// client/src/components/Profile/ProfileView.jsx

export default function ProfileView({ hr }) {
  return (
    <div className="bg-white/70 shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
      <div className="p-6 border-gray-200 border-b">
        <h2 className="font-semibold text-gray-900 text-lg">
          Personal Information
        </h2>
      </div>

      <div className="space-y-6 p-6">
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <Detail label="Full Name" value={hr.fullName} />
          <Detail label="Email" value={hr.email} type="email" />
          <Detail label="Phone" value={hr.phone} type="tel" />
          <Detail label="Department" value={hr.department} />
          <Detail label="Role" value={hr.role} />
          <Detail label="Status" value={hr.isActive ? "Active" : "Inactive"} />
          <Detail
            label="Last Login"
            value={
              hr.lastLogin ? new Date(hr.lastLogin).toLocaleString() : "Never"
            }
          />
        </div>

        {hr.address && (
          <div>
            <h3 className="mb-3 font-medium text-gray-900">Address</h3>
            <div className="space-y-1 text-gray-700 text-sm">
              <p>{hr.address.street}</p>
              <p>
                {hr.address.city}, {hr.address.state}
              </p>
              <p>{hr.address.postalCode}</p>
              <p>{hr.address.country}</p>
            </div>
          </div>
        )}

        {hr.metadata && Object.keys(hr.metadata).length > 0 && (
          <div>
            <h3 className="mb-3 font-medium text-gray-900">Additional Info</h3>
            <div className="gap-3 grid grid-cols-1 md:grid-cols-2">
              {Object.entries(hr.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600">{key}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value, type = "text" }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700 text-sm">
        {label}
      </label>
      <p className="text-gray-900 text-sm">
        {type === "email" ? <a href={`mailto:${value}`}>{value}</a> : value}
      </p>
    </div>
  );
}
