export const CreditIndicator = ({
  credit,
  handlePayment,
}: {
  credit: number;
  handlePayment: () => Promise<void>;
}) => {
  return (
    <div className="stats bg-primary text-primary-content">
      <div className="stat">
        <div className="stat-title">Account balance</div>
        <div className="stat-value">{credit} Stamp(s)</div>
        <div className="stat-actions">
          <button className="btn btn-success btn-sm" onClick={handlePayment}>
            Add credits
          </button>
        </div>
      </div>
    </div>
  );
};
