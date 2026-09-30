const Login = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg border w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">University Sign In</h2>
        <p className="text-gray-600 mb-6 text-sm">Use your Microsoft Student Account to log in.</p>
        <button className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition">
          Sign in with Microsoft
        </button>
      </div>
    </div>
  );
};

export default Login;