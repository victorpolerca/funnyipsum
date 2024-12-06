export async function fetchSwears(type: string, length: number): Promise<string> {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, length }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch swears.");
    }

    const data = await response.json();
    return data.result || "No swears were generated.";
  } catch (error) {
    throw error;
  }
}
