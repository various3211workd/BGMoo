export async function saveSampleMusics(userId: string, token: string, sampleMusics: any[]) {
  try {
    const response = await fetch(import.meta.env.VITE_API_URL + "/save_sample_musics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        userId,
        sampleMusics,
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("sampleMusics saved successfully");
    } else {
      console.error("Error saving sampleMusics:", data.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}



export async function getSampleMusics(userId: string, token: string) {
  try {
    const response = await fetch(import.meta.env.VITE_API_URL+"/get_sample_musics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        userId,
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Retrieved sampleMusics:", data.sampleMusics);
      return data.sampleMusics;
    } else {
      console.error("Error retrieving sampleMusics:", data.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
