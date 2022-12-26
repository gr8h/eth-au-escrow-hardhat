export default function Escrow(props) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Id </div>
          <div> {props.id} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {props.value} ETH</div>
        </li>
        {props.isApproved ? (
          <div
            className="complete"
            id={props.id}
          >
            Approved ✓
          </div>
        ) : (
          <div
            className="button"
            id={props.id}
            onClick={props.handleApprove}
          >
            Approve
          </div>
        )}
      </ul>
    </div>
  );
}
