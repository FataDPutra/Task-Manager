import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaCircle,
  FaClock,
  FaCheckCircle,
  FaCalendarAlt,
  FaUser,
  FaSave,
} from "react-icons/fa";

const TaskDetail = ({ task, onClose, onEdit, onDelete }) => {
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

  const getHeaderColor = (status) => {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "To Do":
        return <FaCircle className="text-sm" />;
      case "In Progress":
        return <FaClock className="text-sm" />;
      case "Done":
        return <FaCheckCircle className="text-sm" />;
      default:
        return <FaCircle className="text-sm" />;
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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`${getHeaderColor(
          task.status
        )} rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header dengan warna sesuai status */}
        <div className={`${getHeaderColor(task.status)} p-5 rounded-t-lg`}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">
                {task.title}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  task.status
                )}`}
              >
                {getStatusIcon(task.status)}
                <span>{task.status}</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors ml-3"
              aria-label="Tutup"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-b-lg">
          {/* Description */}
          {task.description && (
            <div className="mb-5">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* Deadline */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <FaCalendarAlt className="text-blue-600" />
                <span className="text-xs font-medium">Deadline</span>
              </div>
              <p className="text-gray-900 font-semibold text-sm">
                {formatDate(task.deadline)}
              </p>
            </div>

            {/* Created By */}
            {task.creator && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FaUser className="text-blue-600" />
                  <span className="text-xs font-medium">Dibuat Oleh</span>
                </div>
                <p className="text-gray-900 font-semibold text-sm">
                  {task.creator.username || task.creator.name || "Unknown"}
                </p>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-5 pb-5 border-b border-gray-200">
            <span className="flex items-center gap-1.5">
              <FaClock className="text-gray-400" />
              <span>Dibuat: {formatDateTime(task.created_at)}</span>
            </span>
            {task.updated_at && (
              <span className="flex items-center gap-1.5">
                <FaClock className="text-gray-400" />
                <span>Diupdate: {formatDateTime(task.updated_at)}</span>
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                onEdit(task);
                onClose();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg flex items-center justify-center transition-colors shadow-sm"
              aria-label="Edit task"
              title="Edit Task"
            >
              <FaEdit className="text-base" />
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm("Apakah Anda yakin ingin menghapus task ini?")
                ) {
                  onDelete(task.task_id);
                  onClose();
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-lg flex items-center justify-center transition-colors shadow-sm"
              aria-label="Hapus task"
              title="Hapus Task"
            >
              <FaTrash className="text-base" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
