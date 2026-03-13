import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  ArrowLeft, Calendar, Users, Clock, TrendingUp,
  Paperclip, MoreVertical, Star, CheckCircle, Circle
} from 'lucide-react';
import Button from '@/Component/Button/Button';
import { projectsData } from '@/pages/utils/data';

const ProjectDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState('overview');

  const project = useMemo(() => {
    if (!id) return null;
    return projectsData.find((item) => item.id === Number(id));
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center text-white">
        Project not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Projects</span>
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <Star size={24} />
                </button>
              </div>
              <p className="text-gray-400 max-w-2xl">{project.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                title="Edit Project"
                className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 px-6 py-2.5 rounded-xl"
              />
              <button className="p-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-gray-400 hover:text-white transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">Status</span>
            </div>
            <p className="text-white font-semibold">{project.status}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-gray-400" />
              <span className="text-xs text-gray-400">Progress</span>
            </div>
            <p className="text-white font-semibold">{project.progress}%</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-xs text-gray-400">Due Date</span>
            </div>
            <p className="text-white font-semibold">{project.dueDate}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={14} className="text-gray-400" />
              <span className="text-xs text-gray-400">Tasks</span>
            </div>
            <p className="text-white font-semibold">
              {project.completedTasks}/{project.totalTasks}
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={14} className="text-gray-400" />
              <span className="text-xs text-gray-400">Team</span>
            </div>
            <p className="text-white font-semibold">{project.teamMembers.length} Members</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-700">
            {['overview', 'tasks', 'team', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize transition-all relative ${
                  activeTab === tab ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Progress Overview</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-400">Overall Progress</span>
                      <span className="text-sm text-white font-semibold">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-6">Tasks</h3>

                <div className="space-y-3">
                  {project.tasks?.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-4 p-4 bg-gray-900/50 border border-gray-700 rounded-lg"
                    >
                      <div>
                        {task.status === 'completed' ? (
                          <CheckCircle className="text-green-400" size={20} />
                        ) : task.status === 'in-progress' ? (
                          <Clock className="text-blue-400" size={20} />
                        ) : (
                          <Circle className="text-gray-500" size={20} />
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-white font-medium">{task.title}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {task.assignee} • Due {task.dueDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Team Members</h3>
                <div className="space-y-3">
                  {project.teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 p-4 bg-gray-900/50 border border-gray-700 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-2xl">
                        {member.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{member.name}</p>
                        <p className="text-sm text-gray-400">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {project.activity?.map((activity) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-lg">👤</span>
                      </div>
                      <div>
                        <p className="text-white text-sm">
                          <span className="font-semibold">{activity.user}</span>{" "}
                          <span className="text-gray-400">{activity.action}</span>{" "}
                          <span className="text-blue-400">{activity.target}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Team</h3>
              <div className="flex -space-x-3 mb-4">
                {project.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-2 border-gray-800 text-lg"
                    title={member.name}
                  >
                    {member.avatar}
                  </div>
                ))}
              </div>
              <Button
                title="Add Member"
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm"
              />
            </div>

           <div className="space-y-3">
  {project.files?.map((file) => (
    <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
      <Paperclip className="text-gray-400" size={16} />
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{file.size}</p>
      </div>
    </div>
  ))}
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;