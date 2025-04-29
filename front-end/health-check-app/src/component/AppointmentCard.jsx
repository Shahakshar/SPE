const AppointmentCard = ({ appointment, type }) => {
    const colorMap = {
        today: "bg-blue-100 border-blue-400",
        upcoming: "bg-green-100 border-green-400",
        past: "bg-gray-100 border-gray-400"
    };

    return (
        <div className={`p-4 border-l-4 rounded shadow ${colorMap[type]} mb-3`}>
            <h3 className="text-lg font-semibold">{appointment.title || 'Consultation'}</h3>
            <p className="text-sm">Time: {appointment.time}</p>
            <p className="text-sm text-gray-600">With: {appointment.with || 'Patient Name'}</p>
        </div>
    );
};

export default AppointmentCard;