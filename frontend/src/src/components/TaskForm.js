import { useState, useEffect } from "react";
import { taskAPI } from "../services/api";
import {
  FaTimes,
  FaSave,
  FaEdit,
  FaHeading,
  FaAlignLeft,
  FaListUl,
  FaCalendarAlt,
  FaCircle,
  FaClock,
  FaCheckCircle,
  FaChevronDown,
} from "react-icons/fa";

const TaskForm = ({ task, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do",
    deadline: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);

  useEffect(() => {
    if (task) {
      // Format deadline untuk input date (YYYY-MM-DD)
      const deadline = task.deadline ? task.deadline.split("T")[0] : "";
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "To Do",
        deadline: deadline,
      });
    } else {
      // Set default deadline ke hari ini
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        title: "",
        description: "",
        status: "To Do",
        deadline: today,
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStatusSelect = (value) => {
    setFormData({
      ...formData,
      status: value,
    });
    setOpenStatusDropdown(false);
  };

  // Close dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".status-dropdown-form")) {
        setOpenStatusDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (task) {
        // Update task - hanya kirim field yang boleh di-update
        const updateData = {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          deadline: formData.deadline,
        };
        await taskAPI.update(task.task_id, updateData);
      } else {
        // Create task
        await taskAPI.create(formData);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan task");
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .join(", ");
        setError(errorMessages);
      }
    } finally {
      setLoading(false);
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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header dengan gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                {task ? "Edit Task" : "Tambah Task Baru"}
              </h2>
              {task && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm ${
                    formData.status === "To Do"
                      ? "text-yellow-100"
                      : formData.status === "In Progress"
                      ? "text-orange-100"
                      : "text-green-100"
                  }`}
                >
                  {getStatusIcon(formData.status)}
                  <span>{formData.status}</span>
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors ml-3"
              aria-label="Tutup"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-5">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label
                htmlFor="title"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1"
              >
                <FaHeading className="text-xs text-gray-500" />
                <span>Judul Task</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                placeholder="Masukkan judul task"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1"
              >
                <FaAlignLeft className="text-xs text-gray-500" />
                <span>Deskripsi</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                placeholder="Masukkan deskripsi task (opsional)"
              />
            </div>

            <div className="status-dropdown-form">
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <FaListUl className="text-xs text-gray-500" />
                <span>Status</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenStatusDropdown(!openStatusDropdown)}
                  className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white cursor-pointer hover:border-gray-400 transition-colors text-left flex items-center"
                >
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {formData.status === "To Do" && (
                      <FaCircle className="text-yellow-500 text-xs" />
                    )}
                    {formData.status === "In Progress" && (
                      <FaClock className="text-orange-500 text-xs" />
                    )}
                    {formData.status === "Done" && (
                      <FaCheckCircle className="text-green-500 text-xs" />
                    )}
                  </div>
                  <span className="pl-6">{formData.status}</span>
                  <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
                    <FaChevronDown
                      className={`text-gray-400 text-xs transition-transform ${
                        openStatusDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {openStatusDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <button
                      type="button"
                      onClick={() => handleStatusSelect("To Do")}
                      className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                    >
                      <FaCircle className="text-yellow-500 text-xs" />
                      <span>To Do</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusSelect("In Progress")}
                      className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center gap-2.5 transition-colors border-t border-gray-100"
                    >
                      <FaClock className="text-orange-500 text-xs" />
                      <span>In Progress</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusSelect("Done")}
                      className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center gap-2.5 transition-colors border-t border-gray-100"
                    >
                      <FaCheckCircle className="text-green-500 text-xs" />
                      <span>Done</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="deadline"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1"
              >
                <FaCalendarAlt className="text-xs text-gray-500" />
                <span>Deadline</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-5 mt-5 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {loading ? (
                  "Menyimpan..."
                ) : (
                  <>
                    {task ? <FaEdit /> : <FaSave />}
                    <span>{task ? "Update" : "Simpan"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
