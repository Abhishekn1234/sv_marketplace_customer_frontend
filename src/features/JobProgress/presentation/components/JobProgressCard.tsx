export function JobProgressCard() {
  return (
    <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm">
      <h2 className="text-[16px] font-bold text-gray-900 mb-5">
        Task Checklist
      </h2>

      <div className="flex flex-col gap-3">
        {[
          { title: "Initial inspection and diagnosis", status: "completed" },
          { title: "Gather necessary tools and parts", status: "completed" },
          { title: "Repair and fix the issue", status: "progress" },
          { title: "Test and verify the repair", status: "pending" },
          { title: "Clean up work area", status: "pending" },
        ].map((task, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 p-4 rounded-xl border transition
              ${
                task.status === "completed"
                  ? "bg-emerald-50 border-emerald-200"
                  : task.status === "progress"
                  ? "bg-blue-50 border-blue-500"
                  : "bg-gray-50 border-gray-200"
              }`}
          >
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center
                ${
                  task.status === "completed"
                    ? "bg-emerald-500"
                    : task.status === "progress"
                    ? "bg-blue-600 animate-pulse"
                    : "border-2 border-gray-300 bg-white"
                }`}
            />

            <div className="flex-1">
              <div
                className={`text-[15px] font-semibold ${
                  task.status === "completed"
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {task.title}
              </div>
              <div className="text-[13px] text-gray-500">
                {task.status === "completed"
                  ? "Completed"
                  : task.status === "progress"
                  ? "In Progress"
                  : "Pending"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
