import React from 'react';
import Appear from './Appear';
import ErrorBox from './ErrorBox';
import {Context} from './ClientContext';

export function get(...args) {
  return async opts => {
    return await opts.operation(...args);
  };
}

export function useApi(apiName, operationId, effect, deps = []) {
  const client = React.useContext(Context);

  const api = client.apis[apiName];
  if (!api) {
    throw new Error(`unknown api ${apiName}`);
  }

  const operation = api[operationId];
  if (!operation) {
    throw new Error(`unknown operation ${operationId} in API ${apiName}`);
  }

  return useResult(opts => {
    effect({...opts, operation(a, b) {
      return operation(a, {
        ...b,
        userFetch(url, fetchOpts) {
          return fetch(url, {
            ...fetchOpts,
            signal: opts.signal
          });
        }
      }).then(res => res.body);
    }});
  }, [...deps, client]);
};

export function prom(asyncEffectFn) {
  return opts => {
    asyncEffectFn({...opts, callback: null})
      .then(value => opts.callback(null, value))
      .catch(err => opts.callback(err, null));
  };
}

export function thenRetry(millis) {
  return thenRepeatIf(millis, ifNoError);
}

export function thenRepeat(millis) {
  return thenRepeatIf(millis, ifOneEqOne);
}

export function ifNoError(err, _value) {
  return Boolean(err);
}

export function ifOneEqOne(_err, _value) {
  return true;
}

export function thenImmediate() {
  return (_err, _value, signal, next) => {
    if (!signal.aborted) {
      next();
    }
  };
}

export function thenRepeatIf(millis, predicate = () => true) {
  return (err, value, signal, next) => {
    if (!predicate(err, value)) {
      return;
    }

    if (signal.aborted) {
      return;
    }

    signal.addEventListener('abort', onAbort);
    function cleanup() {
      signal.removeEventListener('abort', onAbort);
    }

    const timeout = setTimeout(() => {
      next();
      cleanup();
    }, millis);

    function onAbort() {
      clearTimeout(timeout);
      cleanup();
    }
  };
}

export function repeat(effect, then = thenImmediate) {
  return opts => {
    recall();

    function recall() {
      if (opts.signal.aborted) {
        return;
      }

      effect({...opts, callback(err, value) {
        opts.callback(err, value);
        then(err, value, opts.signal, recall);
      }});
    }
  };
}

export function retry(millis, effect) {
  return repeat(effect, thenRetry(millis));
}

export function useResult(effect, deps) {
  const [value, setValue] = React.useState();
  const [error, setError] = React.useState();

  React.useEffect(() => {
    const abortController = new AbortController();

    effect({
      signal: abortController.signal,
      callback(err, value) {
        if (abortController.signal.aborted) {
          return;
        }

        if (err) {
          setError(err);
          // keep value
        } else {
          setValue(value);
          setError(null);
        }
      }
    });

    return () => {
      abortController.abort();
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return React.useMemo(() => ({error, value}), [error, value]);
};

export function Loading({result, message, children}) {
  const {error, value} = result;

  return (
    <Appear loadingMessage={message}>{
      (!error && !value)
        ? null
        : (
          <React.Fragment>
            {error ? (<ErrorBox task={message}>{error}</ErrorBox>) : null}
            {value ? children(value) : null}
          </React.Fragment>
        )
    }</Appear>
  );
}
