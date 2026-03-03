import "@/App.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuthStore from "@/stores/useAuthStore";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import GuestRoute from "@/components/guards/GuestRoute";
import { ToastContainer } from "react-toastify";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import HomePage from "@/pages/HomePage";
import PostDetailPage from "@/pages/PostDetailPage";
import ProfilePage from "@/pages/ProfilePage";
import AlbumDetailPage from "@/pages/AlbumDetailPage";
import TodosPage from "@/pages/TodosPage";
import BookmarksPage from "@/pages/BookmarksPage";
import NotFoundPage from "@/pages/NotFoundPage";
import FollowRequestsPage from "@/pages/FollowRequestsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/auth/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/auth/register"
              element={
                <GuestRoute>
                  <RegisterPage />
                </GuestRoute>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PostDetailPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/todos"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TodosPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <BookmarksPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/follow-requests"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <FollowRequestsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:userId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:userId/albums/:albumId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AlbumDetailPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
