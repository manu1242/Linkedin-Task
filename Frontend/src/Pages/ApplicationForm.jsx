import { useState, useEffect } from "react";
import api from "../Api/axios";

export default function ApplicationForm() {
  const [application, setApplication] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [documents, setDocuments] = useState([]);

  const fetchApplication = async () => {
    try {
      const res = await api.get("/applications/my-status");
      setApplication(res.data);
      console.log(res.data);
    } catch (error) {
      console.log("Failed to load applications:", error);
    }
  };

  const submitApplication = async () => {
    try {
      const res = await api.post("/applications/submit", {
        businessName,
        businessType,
        documents,
      });
      setApplication(res.data);
    } catch (error) {
      console.log("Failed to submit application:", error);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      {application ? (
        <div className="border p-4 rounded">
          <p>Business Name: {application.businessName}</p>
          <p>Business Type: {application.businessType}</p>
          <p>Status: {application.status}</p>
          {application.adminNote && <p>Admin Note: {application.adminNote}</p>}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Business Type"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Documents (comma separated URLs)"
            value={documents}
            onChange={(e) => setDocuments(e.target.value.split(","))}
            className="border p-2 w-full rounded"
          />
          <button
            onClick={submitApplication}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit Application
          </button>
        </div>
      )}
    </div>
  );
}
