import {
  FaEdit,
  FaTrash,
  FaCircle,
  FaClock,
  FaCheckCircle,
  FaCalendarAlt,
} from "react-icons/fa";

const TaskItem = ({ task, onEdit, onDelete, onView }) => {
  // Generate random rotation untuk efek natural sticky note
  const getRotation = () => {
    const rotations = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5];
    return rotations[task.task_id % rotations.length];
  };

  const getStickyColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-yellow-100";
      case "In Progress":
        return "bg-yellow-200";
      case "Done":
        return "bg-green-100";
      default:
        return "bg-yellow-100";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-yellow-300 text-yellow-900";
      case "In Progress":
        return "bg-orange-300 text-orange-900";
      case "Done":
        return "bg-green-300 text-green-900";
      default:
        return "bg-yellow-300 text-yellow-900";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "To Do":
        return <FaCircle className="text-xs" />;
      case "In Progress":
        return <FaClock className="text-xs" />;
      case "Done":
        return <FaCheckCircle className="text-xs" />;
      default:
        return <FaCircle className="text-xs" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`${getStickyColor(
        task.status
      )} p-4 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer relative`}
      style={{
        transform: `rotate(${getRotation()}deg)`,
        minHeight: "180px",
        maxWidth: "300px",
      }}
      onClick={() => onView && onView(task)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `rotate(0deg) scale(1.02)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${getRotation()}deg) scale(1)`;
      }}
    >
      {/* Efek garis-garis seperti kertas */}
      <div
        className="absolute top-0 left-0 right-0 h-8 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 31px, rgba(0,0,0,0.1) 31px, rgba(0,0,0,0.1) 32px)",
        }}
      ></div>

      <div className="flex flex-col gap-2 relative z-10 h-full">
        {/* Header dengan title dan status */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-gray-900 break-words flex-1 leading-tight">
              {task.title}
            </h3>
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${getStatusColor(
                task.status
              )}`}
            >
              {getStatusIcon(task.status)}
              <span>{task.status}</span>
            </span>
          </div>
          {task.description && (
            <p className="text-sm text-gray-700 break-words leading-relaxed line-clamp-3 overflow-hidden">
              {task.description}
            </p>
          )}
        </div>

        {/* Info tanggal */}
        <div className="flex items-center gap-1.5 text-xs text-gray-600 pt-2 border-t border-gray-300 border-dashed mb-12">
          <FaCalendarAlt className="text-gray-400" />
          <span className="font-semibold">Deadline:</span>
          <span>{formatDate(task.deadline)}</span>
        </div>

        {/* Action buttons - fixed di kanan bawah */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded shadow-sm flex items-center justify-center transition-colors z-20"
            aria-label="Edit task"
            title="Edit"
          >
            <FaEdit className="text-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.task_id);
            }}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded shadow-sm flex items-center justify-center transition-colors z-20"
            aria-label="Hapus task"
            title="Hapus"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
