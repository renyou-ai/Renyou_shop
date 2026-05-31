export default function OrderDetailsDrawer({
  order,
  onClose,
}) {

  if (!order) return null;

  return (

    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">

      <div className="w-full max-w-xl h-full bg-white shadow-2xl overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b">

          <div>

            <h2 className="text-xl font-semibold">
              Order Details
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              #{order._id}
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-black"
          >
            ×
          </button>

        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-8">

          {/* CUSTOMER */}
          <div>

            <h3 className="font-semibold mb-3">
              Customer
            </h3>

            <div className="space-y-2 text-sm text-gray-600">

              <p>
                {order.shippingAddress?.fullName}
              </p>

              <p>
                {order.user?.email}
              </p>

              <p>
                {order.shippingAddress?.phone}
              </p>

            </div>

          </div>

          {/* ADDRESS */}
          <div>

            <h3 className="font-semibold mb-3">
              Shipping Address
            </h3>

            <div className="text-sm text-gray-600 space-y-1">

              <p>
                {order.shippingAddress?.address}
              </p>

              <p>
                {order.shippingAddress?.city}
              </p>

              <p>
                {order.shippingAddress?.postalCode}
              </p>

              <p>
                {order.shippingAddress?.country}
              </p>

            </div>

          </div>

          {/* ITEMS */}
          <div>

            <h3 className="font-semibold mb-4">
              Products
            </h3>

            <div className="space-y-4">

              {order.items?.map(
                (item, i) => (

                  <div
                    key={i}
                    className="flex items-center gap-4"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                    />

                    <div className="flex-1">

                      <p className="font-medium">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Qty:
                        {" "}
                        {item.qty}
                      </p>

                    </div>

                    <p className="font-semibold">
                      $
                      {Number(
                        item.price
                      ).toFixed(2)}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

          {/* TOTAL */}
          <div className="border-t pt-5 flex items-center justify-between">

            <span className="font-semibold text-lg">
              Total
            </span>

            <span className="font-bold text-xl text-[#4a46a0]">
              $
              {Number(
                order.totalPrice
              ).toFixed(2)}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}