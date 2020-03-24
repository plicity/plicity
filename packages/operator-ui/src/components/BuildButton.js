export default function ({building, onClick, children}) {
  return (
    <button className="btn btn-sm btn-secondary" onClick={onClick} disabled={building}>
      {building
        ? (<span className="spinner-grow spinner-grow-sm"></span>)
        : (<i class="fas fa-stream"></i>)
      }
      <span className="pl-2">{children}</span>
    </button>
  );
}