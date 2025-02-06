export async function saveReferences(reference: any[]) {
  chrome.storage.local.get(["userId", "token"], async (result) => {
    if (result.userId && result.token) {
      try {
        const userId = result.userId;
        const token = result.token;
        const response = await fetch(
          import.meta.env.VITE_API_URL + "/save_references",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: token,
              userId,
              references: reference,
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          console.log("sreferences saved successfully");
        } else {
          console.error("Error saving references:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  });
}

export async function getReferences(userId: string, token: string) {
  try {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/get_references",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          userId,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log("Retrieved get_references:", data.references);
      return data.references;
    } else {
      console.error("Error retrieving get_references:", data.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
