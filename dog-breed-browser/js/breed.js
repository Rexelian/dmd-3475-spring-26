const breedsContainer = document.getElementById("dog-breeds");

//fetch from dog api
fetch("https://dogapi.dog/api/v2/breeds")
  .then(res => res.json())
  .then(data => {
    const breeds = data.data;

    //this renders the list of dog breeds as clickable div elements
    //forEach loop iterates through the list, assigning each breed a div
    breeds.forEach(breed => {
      const div = document.createElement("div");
      div.classList.add("breed-item");

      // Display the breed name
      div.textContent = breed.attributes.name;

      // When clicked, go to profile.html with the breed ID in the URL
      div.addEventListener("click", () => {
        //URL parameters
        window.location.href = `profile.html?id=${breed.id}`;
      });

      breedsContainer.appendChild(div);
    });
  })
  .catch(err => console.error("Error fetching breeds:", err));
