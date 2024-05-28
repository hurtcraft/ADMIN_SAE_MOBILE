export async function getData(url,setData) {
        fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setData(data);
          })
          .catch((error) => {
            console.error("Erreur lors de l'envoi des données:", error);
          });
    
}
