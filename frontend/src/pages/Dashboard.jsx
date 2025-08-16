import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { LucideFilePlus, LucideTrash2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { ResumeSummaryCard } from "../components/Cards";
import toast from "react-hot-toast";
import moment from "moment";
import { Modal } from "../components/Modal";
import { CreateResumeForm } from "../components/CreateResumeForm";
const Dashboard = () => {
  const navigate = useNavigate();
  const [allResume, setAllResume] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const calculateCompletion = (resume) => {
    let completedFields = 0;
    let totalFields = 0;

    // Profile Info
    totalFields += 3;
    if (resume.profileInfo?.fullName) completedFields++;
    if (resume.profileInfo?.designation) completedFields++;
    if (resume.profileInfo?.summary) completedFields++;

    // Contact Info
    totalFields += 2;
    if (resume.contactInfo?.email) completedFields++;
    if (resume.contactInfo?.phone) completedFields++;

    // Work Experience
    resume.workExperience?.forEach((exp) => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.role) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education
    resume.education?.forEach((edu) => {
      totalFields += 4;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    // Skills
    resume.skills?.forEach((skill) => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects
    resume.projects?.forEach((project) => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications
    resume.certifications?.forEach((cert) => {
      totalFields += 3;
      if (cert.title) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.year) completedFields++;
    });

    // Languages
    resume.languages?.forEach((lang) => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests
    totalFields += resume.interests?.length || 0;
    completedFields +=
      resume.interests?.filter((i) => i?.trim() !== "")?.length || 0;

    return Math.round((completedFields / totalFields) * 100);
  };
  const fetchAllResumes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      // Add completion percentage to each resumes
      const resumeWithCompletion = response.data.map((resume) => ({
        ...resume,
        completion: calculateCompletion(resume),
      }));
      setAllResume(resumeWithCompletion);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllResumes();
  }, []);

  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;
    try {
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeToDelete));
      toast.success("Resume deleted successfully");
      setAllResume((prev) => prev.filter((r) => r._id !== resumeToDelete));
      fetchAllResumes();
    } catch (error) {
      console.error("Error deleting resume", error);
      toast.error("failed to delete resume");
    } finally {
      setResumeToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteClick = (id) => {
    setResumeToDelete(id);
    setShowDeleteConfirm(true);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="">
            <h1 className="text-2xl font-bold text-gray-900">My Resume</h1>
            <p className="text-gray-600">
              {allResume.length > 0
                ? `You have ${allResume.length} resume${
                    allResume.length !== 1 ? "s" : ""
                  }`
                : " Start building your professional resume"}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className="group relative px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-violet-200"
              onClick={() => setOpenCreateModal(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center gap-3">
                Create Now
                <LucideFilePlus
                  className="group-hover:transform-x-1 transform-transition"
                  size={18}
                />
              </span>
            </button>
          </div>
        </div>
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
          </div>
        )}

        {/* Empty state */}
        {!loading && allResume.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-violet-100 p-4 rounded-full mb-4">
              <LucideFilePlus size={32} className="text-violet-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Resumes Yet
            </h3>
            <p className="text-gray-600 max-w-md mb-6">
              "You haven't created any resumes yet. Start building your
              professional resume to land your dream job."
            </p>
            <button
              className="group relative px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-violet-200"
              onClick={() => setOpenCreateModal(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center gap-3">
                Create Your First Resume
                <LucideFilePlus
                  className="group-hover:transform-x-1 transform-transition"
                  size={20}
                />
              </span>
            </button>
          </div>
        )}

        {/* Grid View */}
        {!loading && allResume.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className="flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-blue-50 border-2 border-dashed border-violet-300 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg hover:border-violet-500 h-full"
              onClick={() => setOpenCreateModal(true)}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center mb-4">
                <LucideFilePlus size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                Create New Resume
              </h3>
              <p className="text-gray-600 text-center">
                Start building your career
              </p>
            </div>
            {allResume.map((resume) => (
              <ResumeSummaryCard
                key={resume._id}
                imgUrl={resume.thumbnailLink}
                title={resume.title}
                createdAt={resume.createdAt}
                updatedAt={resume.updatedAt}
                onSelect={() => navigate(`/resume/${resume._id}`)}
                onDelete={() => handleDeleteClick(resume._id)}
                completion={resume.completion || 0}
                isPremium={resume.isPremium}
                isNew={moment().diff(moment(resume.createdAt), "days") < 7}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
        maxWidth="max-w-2xl"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Create New Resume
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setOpenCreateModal(false)}
            >
              X
            </button>
          </div>
          <CreateResumeForm
            onSuccess={() => {
              setOpenCreateModal(false);
              fetchAllResumes();
            }}
          />
        </div>
      </Modal>

      {/* delete Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Deletion"
        showActionBtn
        actionBtnText="Delete"
        actionBtnClassName="bg-red-600 hover:bg-red-700"
        onActionClick={handleDeleteResume}
      >
        <div className="p-4">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <LucideTrash2 className="text-orange-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Resume?
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this resume? This action cannot be
              undone.{" "}
            </p>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
