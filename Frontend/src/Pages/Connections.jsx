import { useEffect, useState } from "react";
import Api from "../Api/axios";

export default function Connections() {
  const [connections, setConnections] = useState([]);

  const load = async () => {
    const res = await api.get("/connections");
    setConnections(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const connect = async (id) => {
    await api.post(`/connections/${id}/request`);
    load();
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-3">Connections</h2>
      {connections.length === 0 && <p>No connections yet</p>}
      <ul>
        {connections.map((c) => (
          <li key={c._id} className="border-b py-2 flex justify-between">
            <span>{c.name}</span>
            <button
              className="text-sm bg-green-600 text-white px-3 py-1 rounded"
              onClick={() => connect(c._id)}
            >
              Connect
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
