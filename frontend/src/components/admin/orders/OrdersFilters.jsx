export default function OrdersFilters({
  statusFilter,
  setStatusFilter,
}) {

  return (

    <div className="flex items-center justify-between mb-6">

      <select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(
            e.target.value
          )
        }
        className="border border-gray-200
                   rounded-xl px-4 py-2.5
                   bg-white text-sm"
      >

        <option value="">
          All Status
        </option>

        <option value="pending">
          Pending
        </option>

        <option value="processing">
          Processing
        </option>

        <option value="shipped">
          Shipped
        </option>

        <option value="delivered">
          Delivered
        </option>

        <option value="cancelled">
          Cancelled
        </option>

      </select>

    </div>
  );
}