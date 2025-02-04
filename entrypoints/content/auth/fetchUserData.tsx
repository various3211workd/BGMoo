const fetchUserData = async () => {
  chrome.storage.sync.get(["token"], async (result) => {
    if (!result.token) {
      console.error("No token found");
      return;
    }

    const response = await fetch("http://localhost:8080/user", {
      headers: { Authorization: `Bearer ${result.token}` },
    });

    if (!response.ok) {
      console.error("Failed to fetch user data");
      return;
    }

    const data = await response.json();
    console.log("User data:", data);
  });
};
