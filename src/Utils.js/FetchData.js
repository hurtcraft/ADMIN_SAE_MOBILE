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

export function getToken(){
    if(localStorage.getItem("token") !== null){
      return localStorage.getItem("token");
    }
    return sessionStorage.getItem("token");
}
export function removeToken(){
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
}


