"use client";

import { useContext, useState, useEffect } from "react";
import AuthContext from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ThemeToggle from "./components/ThemeToggle";
import axios from "axios";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [routineName, setRoutineName] = useState("");
  const [routineDescription, setRoutineDescription] = useState("");
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWorkoutsAndRoutines = async () => {
      try {
        const token = localStorage.getItem("token");
        const [workoutsResponse, routinesResponse] = await Promise.all([
          axios.get("http://localhost:8000/workouts/workouts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/routines", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setWorkouts(workoutsResponse.data);
        setRoutines(routinesResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchWorkoutsAndRoutines();
  }, []);

  const handleCreateWorkout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/workouts",
        {
          name: workoutName,
          description: workoutDescription,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWorkouts([...workouts, response.data]);
      setWorkoutName("");
      setWorkoutDescription("");
    } catch (error) {
      console.error("Failed to create workout:", error);
    }
  };

  const handleCreateRoutine = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/routines",
        {
          name: routineName,
          description: routineDescription,
          workouts: selectedWorkouts,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRoutines([...routines, response.data]);
      setRoutineName("");
      setRoutineDescription("");
      setSelectedWorkouts([]);
    } catch (error) {
      console.error("Failed to create routine:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
            <h1 className="text-3xl font-extrabold mb-4 sm:mb-0">
              Welcome, {user?.username || "User"} 👋
            </h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Accordions Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Workout */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Create Workout</h2>
                <form onSubmit={handleCreateWorkout} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Workout Name"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Workout Description"
                    value={workoutDescription}
                    onChange={(e) => setWorkoutDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Create Workout
                  </button>
                </form>
              </div>
            </div>

            {/* Routine */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Create Routine</h2>
                <form onSubmit={handleCreateRoutine} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Routine Name"
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Routine Description"
                    value={routineDescription}
                    onChange={(e) => setRoutineDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <select
                    multiple
                    value={selectedWorkouts}
                    onChange={(e) =>
                      setSelectedWorkouts(
                        [...e.target.selectedOptions].map(
                          (option) => option.value
                        )
                      )
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    {workouts.map((workout) => (
                      <option key={workout.id} value={workout.id}>
                        {workout.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Create Routine
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Routines List */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Your Routines</h3>
            <div className="grid gap-4">
              {routines.map((routine) => (
                <div
                  key={routine.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h4 className="text-lg font-semibold mb-2">{routine.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {routine.description}
                  </p>
                  {routine.workouts?.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                      {routine.workouts.map((workout) => (
                        <li key={workout.id}>
                          <span className="font-medium">{workout.name}</span>:{" "}
                          {workout.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Home;
