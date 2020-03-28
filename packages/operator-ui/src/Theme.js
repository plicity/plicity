import React from 'react';

export default function Theme() {
  return (
    <div>
      <div className="card my-2" style={{width: '18rem'}}>
        <img className="card-img-top" src="https://via.placeholder.com/300x200" alt="" />
        <div className="card-body">
          <h5 className="card-title">Card title</h5>
          <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          {/* eslint-disable-next-line */}
          <a className="btn btn-primary">Go somewhere</a>
        </div>
      </div>
      <div className="card my-2" style={{width: '18rem'}}>
        <div className="card-body">
          <h5 className="card-title">Card title</h5>
          <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
          <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          {/* eslint-disable-next-line */}
          <a href="#" className="card-link">Card link</a>
          {/* eslint-disable-next-line */}
          <a href="#" className="card-link">Another link</a>
        </div>
      </div>
      <div className="card my-2" style={{width: '18rem'}}>
        <div className="card-header">
          Featured
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Cras justo odio</li>
          <li className="list-group-item">Dapibus ac facilisis in</li>
          <li className="list-group-item">Vestibulum at eros</li>
        </ul>
      </div>
      <div className="card my-2">
        <div className="card-header">
          Featured
        </div>
        <div className="card-body">
          <h5 className="card-title">Special title treatment</h5>
          <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
          {/* eslint-disable-next-line */}
          <a href="#" className="btn btn-primary">Go somewhere</a>
        </div>
      </div>
      <div className="my-2">
        <div className="card text-white bg-primary mb-3" style={{maxWidth: '18rem'}}>
          <div className="card-header">Header</div>
          <div className="card-body">
            <h5 className="card-title">Primary card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div className="card text-white bg-secondary mb-3" style={{maxWidth: '18rem'}}>
          <div className="card-header">Header</div>
          <div className="card-body">
            <h5 className="card-title">Secondary card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div className="card text-white bg-success mb-3" style={{maxWidth: '18rem'}}>
          <div className="card-header">Header</div>
          <div className="card-body">
            <h5 className="card-title">Success card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div className="card text-white bg-danger mb-3" style={{maxWidth: '18rem'}}>
          <div className="card-header">Header</div>
          <div className="card-body">
            <h5 className="card-title">Danger card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div className="card text-white bg-warning mb-3" style={{maxWidth: '18rem'}}>
          <div className="card-header">Header</div>
          <div className="card-body">
            <h5 className="card-title">Warning card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div className="card text-white bg-info mb-3" style={{maxWidth: '18rem'}}>
          <div className="card-header">Header</div>
          <div className="card-body">
            <h5 className="card-title">Info card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div className="card bg-light mb-3" style={{maxWidth: '18rem'}}>
          <div className="card-header">Header</div>
          <div className="card-body">
            <h5 className="card-title">Light card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div className="card text-white bg-dark mb-3" style={{maxWidth: '18rem'}}>
          <div className="card-header">Header</div>
          <div className="card-body">
            <h5 className="card-title">Dark card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
      </div>
      <div className="my-2">
        <div className="card border-primary mb-3" style={{maxWidth: '18rem'}}>
          <div className="card-header">Header</div>
          <div className="card-body text-primary">
            <h5 className="card-title">Primary card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div className="card border-secondary mb-3" style={{maxWidth: '18rem'}}>
          <div className="card-header">Header</div>
          <div className="card-body text-secondary">
            <h5 className="card-title">Secondary card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div className="card border-success mb-3" style={{maxWidth: '18rem'}}>
          <div className="card-header">Header</div>
          <div className="card-body text-success">
            <h5 className="card-title">Success card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div className="card border-danger mb-3" style={{maxWidth: '18rem'}}>
          <div className="card-header">Header</div>
          <div className="card-body text-danger">
            <h5 className="card-title">Danger card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div className="card border-warning mb-3" style={{maxWidth: '18rem'}}>
          <div className="card-header">Header</div>
          <div className="card-body text-warning">
            <h5 className="card-title">Warning card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div className="card border-info mb-3" style={{maxWidth: '18rem'}}>
          <div className="card-header">Header</div>
          <div className="card-body text-info">
            <h5 className="card-title">Info card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div className="card border-light mb-3" style={{maxWidth: '18rem'}}>
          <div className="card-header">Header</div>
          <div className="card-body">
            <h5 className="card-title">Light card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
        <div className="card border-dark mb-3" style={{maxWidth: '18rem'}}>
          <div className="card-header">Header</div>
          <div className="card-body text-dark">
            <h5 className="card-title">Dark card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
