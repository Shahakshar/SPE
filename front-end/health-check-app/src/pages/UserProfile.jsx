// import React, { useEffect, useState } from "react";

// const UserProfile = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     console.log("Stored User:", storedUser);
//     if (storedUser) {
//       const parsedUser = JSON.parse(storedUser);
//       setUser(parsedUser.user);
//     }
//   }, []);

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center h-screen text-xl font-semibold">
//         Loading profile...
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full space-y-4">
//         <div className="flex items-center space-x-4">
//           <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold uppercase">
//             {user.name.charAt(0)}
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
//             <p className="text-sm text-gray-500">{user.email}</p>
//             <p className="text-sm text-gray-500">Role: {user.role}</p>
//           </div>
//         </div>

//         <div className="border-t pt-4 space-y-2">
//           <div className="flex justify-between text-gray-700">
//             <span className="font-medium">User ID:</span>
//             <span>{user.id}</span>
//           </div>
//           <div className="flex justify-between text-gray-700">
//             <span className="font-medium">Phone:</span>
//             <span>{user.phone}</span>
//           </div>
//           <div className="flex justify-between text-gray-700">
//             <span className="font-medium">Email:</span>
//             <span>{user.email}</span>
//           </div>
//         </div>

//         <div className="pt-4">
//           <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200">
//             Edit Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;



import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.user);
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-medium text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-3xl w-full space-y-8 border border-gray-200">
        {/* Header Section */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold uppercase shadow-inner">
            {user.name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500">Role: <span className="capitalize">{user.role?.toLowerCase()}</span></p>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
          <div className="p-4 bg-gray-50 rounded-xl border">
            <p className="font-medium text-gray-500">User ID</p>
            <p className="text-base">{user.id}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border">
            <p className="font-medium text-gray-500">Phone</p>
            <p className="text-base">{user.phone}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border">
            <p className="font-medium text-gray-500">Email</p>
            <p className="text-base">{user.email}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border">
            <p className="font-medium text-gray-500">Gender</p>
            <p className="text-base capitalize">{user.gender || "N/A"}</p>
          </div>
        </div>

        {/* Edit Button */}
        <div>
          <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-200">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
