import { useEffect, useState } from "react";
import api from "../Api/axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Load profile data
  const loadProfile = async () => {
    try {
      const res = await api.get("/profile/me");
      setProfile(res.data);
      setHeadline(res.data.headline || "");
      setBio(res.data.bio || "");
      setSkills(res.data.Skills || []);
      setAvatarPreview(res.data.user.avatar || "/default-avatar.png");
    } catch (err) {
      console.error("Failed to load profile:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Update headline, bio, skills
  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put("/profile/me", { headline, bio, Skills: skills });
      loadProfile();
    } catch (err) {
      console.error("Failed to update profile:", err.response?.data || err.message);
    }
  };

  // Upload avatar
  const uploadAvatar = async (e) => {
    e.preventDefault();
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const res = await api.post("/profile/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatarPreview(res.data.avatar); // Update preview
      setAvatarFile(null);
      loadProfile(); // Reload full profile
    } catch (err) {
      console.error("Failed to upload avatar:", err.response?.data || err.message);
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      {/* Avatar */}
      <div className="flex items-center mb-4">
        <img
          src={avatarPreview || "/default-avatar.png"}
          alt="avatar"
          className="w-24 h-24 rounded-full border mr-4 object-cover"
        />
        <div>
          <h2 className="text-xl font-bold">{profile.user.Name}</h2>
          <p className="text-gray-500">{profile.user.UserType}</p>
        </div>
      </div>

      {/* Avatar Upload */}
      <form onSubmit={uploadAvatar} className="mb-6 flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setAvatarFile(e.target.files[0]);
            setAvatarPreview(URL.createObjectURL(e.target.files[0])); // preview
          }}
        />
        <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">
          Upload
        </button>
      </form>

      {/* Profile Form */}
      <form onSubmit={updateProfile}>
        <label className="block mb-1 font-semibold">Headline</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <label className="block mb-1 font-semibold">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <label className="block mb-1 font-semibold">Skills (comma separated)</label>
        <input
          type="text"
          value={skills.join(", ")}
          onChange={(e) =>
            setSkills(e.target.value.split(",").map((s) => s.trim()))
          }
          className="w-full border p-2 rounded mb-3"
        />

        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">
          Save Profile
        </button>
      </form>

      {/* Experience */}
      {profile.experience?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Experience</h3>
          {profile.experience.map((exp, i) => (
            <div key={i} className="mb-2 border-b pb-2">
              <p className="font-semibold">{exp.title} at {exp.company}</p>
              <p className="text-gray-500">
                {new Date(exp.from).toLocaleDateString()} -{" "}
                {exp.current ? "Present" : new Date(exp.to).toLocaleDateString()}
              </p>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Business Info */}
      {profile.businessInfo?.companyName && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Business Info</h3>
          <p>Company Name: {profile.businessInfo.companyName}</p>
          <p>Type: {profile.businessInfo.CompanyType}</p>
          {profile.businessInfo.documents?.length > 0 && (
            <div>
              <h4 className="font-semibold">Documents:</h4>
              <ul className="list-disc ml-6">
                {profile.businessInfo.documents.map((doc, i) => (
                  <li key={i}>
                    <a href={doc} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                      {doc.split("/").pop()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
