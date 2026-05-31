export default function OrderStatusBadge({
  status,
}) {

  const styles = {

    pending:
      "bg-yellow-100 text-yellow-700",

    processing:
      "bg-blue-100 text-blue-700",

    shipped:
      "bg-purple-100 text-purple-700",

    delivered:
      "bg-green-100 text-green-700",

    cancelled:
      "bg-red-100 text-red-700",
  };

  return (

    <span
      className={`px-3 py-1 rounded-full
                  text-xs font-medium capitalize
                  ${styles[status]}`}
    >
      {status}
    </span>
  );
}