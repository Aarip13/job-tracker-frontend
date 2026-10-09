import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import API from "../api/axios"
import { AuthContext } from "../context/AuthContext"

const FILTERS = ["all", "applied", "interview", "offer", "rejected"]

function Dashboard() {
  const { token, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")
  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "applied",
    link: "",
    notes: ""
  })

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setJobs(res.data)
    } catch (err) {
      toast.error("Failed to fetch jobs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAddJob = async (e) => {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) {
      toast.error("Company and role are required")
      return
    }
    try {
      await API.post("/jobs", form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success("Job added!")
      setForm({ company: "", role: "", status: "applied", link: "", notes: "" })
      setShowForm(false)
      fetchJobs()
    } catch (err) {
      toast.error("Failed to add job")
    }
  }

  const handleDelete = async (id) => {
    try {
      await API.delete(`/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success("Job deleted")
      fetchJobs()
    } catch (err) {
      toast.error("Failed to delete job")
    }
  }

  // NEW — update status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/jobs/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success("Status updated!")
      fetchJobs()
    } catch (err) {
      toast.error("Failed to update status")
    }
  }

  // NEW — filter logic
  const filteredJobs = jobs.filter(j =>
    activeFilter === "all" ? true : j.status === activeFilter
  )

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>

      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Job Tracker</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
          >
            {showForm ? "Cancel" : "+ Add Job"}
          </button>
          <button
            onClick={handleLogout}
            style={{ padding: "8px 16px", background: "#f1f1f1", border: "none", borderRadius: "8px", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Add Job Form */}
      {showForm && (
        <form onSubmit={handleAddJob} style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "20px", marginBottom: "30px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3>Add New Application</h3>
          <input
            name="company"
            placeholder="Company name *"
            value={form.company}
            onChange={handleChange}
            style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
          />
          <input
            name="role"
            placeholder="Role applied for *"
            value={form.role}
            onChange={handleChange}
            style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            name="link"
            placeholder="Job link (optional)"
            value={form.link}
            onChange={handleChange}
            style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
          />
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px", resize: "vertical" }}
          />
          <button
            type="submit"
            style={{ padding: "10px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "500" }}
          >
            Add Application
          </button>
        </form>
      )}

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "10px", textAlign: "center" }}>
          <h3>{jobs.length}</h3>
          <p>Total</p>
        </div>
        <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "10px", textAlign: "center" }}>
          <h3>{jobs.filter(j => j.status === "applied").length}</h3>
          <p>Applied</p>
        </div>
        <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "10px", textAlign: "center" }}>
          <h3>{jobs.filter(j => j.status === "interview").length}</h3>
          <p>Interview</p>
        </div>
        <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "10px", textAlign: "center" }}>
          <h3>{jobs.filter(j => j.status === "offer").length}</h3>
          <p>Offer</p>
        </div>
      </div>

      {/* NEW — Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {FILTERS.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              padding: "6px 16px",
              borderRadius: "99px",
              border: "1px solid #ddd",
              cursor: "pointer",
              fontSize: "13px",
              background: activeFilter === filter ? "#2563eb" : "transparent",
              color: activeFilter === filter ? "white" : "#555",
              fontWeight: activeFilter === filter ? "500" : "normal"
            }}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
            {" "}({filter === "all" ? jobs.length : jobs.filter(j => j.status === filter).length})
          </button>
        ))}
      </div>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          {activeFilter === "all" ? "No jobs added yet. Start tracking!" : `No jobs with status "${activeFilter}"`}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredJobs.map(job => (
            <div key={job._id} style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3>{job.company}</h3>
                <p>{job.role}</p>
                {job.link && <a href={job.link} target="_blank" rel="noreferrer" style={{ fontSize: "12px", color: "#2563eb" }}>View Job</a>}
                {job.notes && <p style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>{job.notes}</p>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {/* NEW — status dropdown to update */}
                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(job._id, e.target.value)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "12px",
                    cursor: "pointer",
                    background:
                      job.status === "applied" ? "#E6F1FB" :
                      job.status === "interview" ? "#FAEEDA" :
                      job.status === "offer" ? "#E1F5EE" : "#FCEBEB",
                    color:
                      job.status === "applied" ? "#0C447C" :
                      job.status === "interview" ? "#633806" :
                      job.status === "offer" ? "#085041" : "#791F1F"
                  }}
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={() => handleDelete(job._id)}
                  style={{ padding: "4px 12px", background: "#FCEBEB", color: "#791F1F", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard