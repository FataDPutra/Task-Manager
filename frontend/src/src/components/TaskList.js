import { useState, useEffect } from "react";
import { taskAPI } from "../services/api";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import TaskDetail from "./TaskDetail";
import {
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaCircle,
  FaClock,
  FaCheckCircle,
  FaChevronDown,
  FaPlus,
  FaList,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";
import { RiProgress6Line } from "react-icons/ri";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetail, setTaskDetail] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    sort: "asc",
    deadline_from: "",
    deadline_to: "",
  });
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
  const [openSortDropdown, setOpenSortDropdown] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Hanya kirim parameter yang ada nilainya
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.sort) params.sort = filters.sort;
      if (filters.deadline_from) params.deadline_from = filters.deadline_from;
      if (filters.deadline_to) params.deadline_to = filters.deadline_to;

      const response = await taskAPI.getAll(params);
      setTasks(response.data.data);
      setError("");
    } catch (err) {
      setError("Gagal memuat tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [
    filters.status,
    filters.sort,
    filters.deadline_from,
    filters.deadline_to,
  ]);

  const handleCreate = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus task ini?")) {
      try {
        await taskAPI.delete(id);
        fetchTasks();
        setSelectedTask(null);
        setTaskDetail(null);
      } catch (err) {
        alert("Gagal menghapus task");
        console.error(err);
      }
    }
  };

  const handleView = async (task) => {
    setSelectedTask(task);
    try {
      // Fetch detail task dengan relasi creator
      const response = await taskAPI.getById(task.task_id);
      setTaskDetail(response.data.data);
    } catch (err) {
      console.error("Gagal memuat detail task:", err);
      // Fallback ke data task yang sudah ada
      setTaskDetail(task);
    }
  };

  const handleCloseDetail = () => {
    setSelectedTask(null);
    setTaskDetail(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleStatusSelect = (value) => {
    setFilters({
      ...filters,
      status: value,
    });
    setOpenStatusDropdown(false);
  };

  const handleSortSelect = (value) => {
    setFilters({
      ...filters,
      sort: value,
    });
    setOpenSortDropdown(false);
  };

  const handleDateChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  const clearDateFilter = () => {
    setFilters({
      ...filters,
      deadline_from: "",
      deadline_to: "",
    });
  };

  // Close dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".status-dropdown")) {
        setOpenStatusDropdown(false);
      }
      if (!event.target.closest(".sort-dropdown")) {
        setOpenSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2">
                <FaList className="text-blue-600" />
                <span>Daftar Task</span>
                {tasks.length > 0 && (
                  <span className="text-xs sm:text-sm font-medium text-white bg-blue-600 px-2 py-0.5 rounded">
                    {tasks.length}
                  </span>
                )}
              </h1>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {/* Toggle Filter Button - Mobile Only */}
              <button
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className={`sm:hidden font-medium py-2 px-4 rounded text-sm flex items-center justify-center gap-2 flex-1 relative ${
                  filters.status || filters.deadline_from || filters.deadline_to
                    ? "bg-blue-100 hover:bg-blue-200 text-blue-700"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <FaFilter
                  className={
                    filters.status ||
                    filters.deadline_from ||
                    filters.deadline_to
                      ? "text-blue-600"
                      : "text-gray-600"
                  }
                />
                <span>Filter</span>
                {(filters.status ||
                  filters.deadline_from ||
                  filters.deadline_to) && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
                <FaChevronDown
                  className={`text-xs transition-transform ${
                    showFiltersMobile ? "rotate-180" : ""
                  }`}
                />
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-sm flex items-center justify-center gap-2"
              >
                <FaPlus />
                <span>Tambah Task</span>
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <div
            className={`bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5 mb-5 sm:mb-6 transition-all duration-300 ${
              showFiltersMobile ? "block" : "hidden sm:block"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <FaFilter className="text-blue-600" />
                <span className="hidden sm:inline">Filter & Urutkan</span>
                <span className="sm:hidden">Filter</span>
              </h2>
              <div className="flex items-center gap-2">
                {(filters.status ||
                  filters.deadline_from ||
                  filters.deadline_to) && (
                  <button
                    onClick={() => {
                      setFilters({
                        status: "",
                        sort: "asc",
                        deadline_from: "",
                        deadline_to: "",
                      });
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <FaTimes className="text-xs" />
                    <span className="hidden sm:inline">Reset Semua</span>
                    <span className="sm:hidden">Reset</span>
                  </button>
                )}
                {/* Close Button - Mobile Only */}
                <button
                  onClick={() => {
                    setShowFiltersMobile(false);
                    setOpenStatusDropdown(false);
                    setOpenSortDropdown(false);
                  }}
                  className="sm:hidden text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Dropdown */}
              <div className="status-dropdown">
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                  <RiProgress6Line className="text-blue-500 text-xs" />
                  <span>Status</span>
                  {filters.status && (
                    <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                      Aktif
                    </span>
                  )}
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenStatusDropdown(!openStatusDropdown);
                      setOpenSortDropdown(false);
                    }}
                    className="w-full pl-9 pr-8 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer hover:border-blue-300 transition-all shadow-sm hover:shadow text-left flex items-center"
                  >
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      {filters.status === "To Do" && (
                        <FaCircle className="text-yellow-500 text-xs" />
                      )}
                      {filters.status === "In Progress" && (
                        <FaClock className="text-orange-500 text-xs" />
                      )}
                      {filters.status === "Done" && (
                        <FaCheckCircle className="text-green-500 text-xs" />
                      )}
                      {!filters.status && (
                        <FaFilter className="text-blue-400 text-xs" />
                      )}
                    </div>
                    <span className="pl-6">
                      {filters.status || "Semua Status"}
                    </span>
                    <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
                      <FaChevronDown
                        className={`text-gray-400 text-xs transition-transform ${
                          openStatusDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {openStatusDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl">
                      <button
                        type="button"
                        onClick={() => handleStatusSelect("")}
                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-blue-50 flex items-center gap-2.5 transition-colors rounded-t-lg"
                      >
                        <FaFilter className="text-blue-400 text-xs" />
                        <span>Semua Status</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusSelect("To Do")}
                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-blue-50 flex items-center gap-2.5 transition-colors border-t border-gray-100"
                      >
                        <FaCircle className="text-yellow-500 text-xs" />
                        <span>To Do</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusSelect("In Progress")}
                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-blue-50 flex items-center gap-2.5 transition-colors border-t border-gray-100"
                      >
                        <FaClock className="text-orange-500 text-xs" />
                        <span>In Progress</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusSelect("Done")}
                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-blue-50 flex items-center gap-2.5 transition-colors border-t border-gray-100"
                      >
                        <FaCheckCircle className="text-green-500 text-xs" />
                        <span>Done</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="sort-dropdown">
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                  {filters.sort === "asc" ? (
                    <FaSortAmountDown className="text-blue-500 text-xs" />
                  ) : (
                    <FaSortAmountUp className="text-blue-500 text-xs" />
                  )}
                  <span>Urutkan</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenSortDropdown(!openSortDropdown);
                      setOpenStatusDropdown(false);
                    }}
                    className="w-full pl-9 pr-8 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer hover:border-blue-300 transition-all shadow-sm hover:shadow text-left flex items-center"
                  >
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      {filters.sort === "asc" ? (
                        <FaSortAmountDown className="text-blue-500 text-xs" />
                      ) : (
                        <FaSortAmountUp className="text-blue-500 text-xs" />
                      )}
                    </div>
                    <span className="pl-6">
                      {filters.sort === "asc"
                        ? "Terdekat Dulu"
                        : "Terjauh Dulu"}
                    </span>
                    <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
                      <FaChevronDown
                        className={`text-gray-400 text-xs transition-transform ${
                          openSortDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {openSortDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl">
                      <button
                        type="button"
                        onClick={() => handleSortSelect("asc")}
                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-blue-50 flex items-center gap-2.5 transition-colors rounded-t-lg"
                      >
                        <FaSortAmountDown className="text-blue-500 text-xs" />
                        <span>Terdekat Dulu</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSortSelect("desc")}
                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-blue-50 flex items-center gap-2.5 transition-colors border-t border-gray-100"
                      >
                        <FaSortAmountUp className="text-blue-500 text-xs" />
                        <span>Terjauh Dulu</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Filter Deadline Dari */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="text-blue-500 text-xs" />
                  <span>Dari Tanggal</span>
                  {filters.deadline_from && (
                    <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                      Aktif
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={filters.deadline_from}
                    onChange={(e) =>
                      handleDateChange("deadline_from", e.target.value)
                    }
                    className="w-full pl-9 pr-8 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow transition-all hover:border-blue-300"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaCalendarAlt className="text-blue-400 text-xs" />
                  </div>
                  {filters.deadline_from && (
                    <button
                      type="button"
                      onClick={() => handleDateChange("deadline_from", "")}
                      className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Hapus filter"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Deadline Sampai */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="text-blue-500 text-xs" />
                  <span>Sampai Tanggal</span>
                  {filters.deadline_to && (
                    <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                      Aktif
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={filters.deadline_to}
                    onChange={(e) =>
                      handleDateChange("deadline_to", e.target.value)
                    }
                    min={filters.deadline_from || undefined}
                    className="w-full pl-9 pr-8 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow transition-all hover:border-blue-300"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaCalendarAlt className="text-blue-400 text-xs" />
                  </div>
                  {filters.deadline_to && (
                    <button
                      type="button"
                      onClick={() => handleDateChange("deadline_to", "")}
                      className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Hapus filter"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Memuat tasks...</p>
            </div>
          ) : (
            <>
              {/* Task List */}
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-base mb-1">Belum ada task</p>
                  <p className="text-gray-500 text-sm">
                    Klik tombol "Tambah Task" di atas untuk membuat task baru
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.task_id}
                      task={task}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onView={handleView}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Task Form Modal */}
      {showForm && <TaskForm task={editingTask} onClose={handleFormClose} />}

      {/* Task Detail Modal */}
      {selectedTask && taskDetail && (
        <TaskDetail
          task={taskDetail}
          onClose={handleCloseDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default TaskList;
