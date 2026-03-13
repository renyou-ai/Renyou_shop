import { useEffect } from "react";
import api from "../api/axiosInstance";

function Home() {

  useEffect(() => {
    api.get("/")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="text-3xl">
      Home Page
    </div>
  );
}

export default Home;