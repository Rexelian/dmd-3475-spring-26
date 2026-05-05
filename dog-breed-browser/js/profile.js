const profileContainer = document.getElementById("breed-profile");

// Get breed ID from URL
const params = new URLSearchParams(window.location.search);
const breedId = params.get("id");

if (!breedId) {
  profileContainer.textContent = "No breed selected.";
} else {
    //fetch data on the chosen breed from dog api
    //this uses the id of the breed you clicked on
  fetch(`https://dogapi.dog/api/v2/breeds/${breedId}`)
    .then(res => res.json())
    .then(data => {
      const breed = data.data.attributes;

      profileContainer.innerHTML = `
        <h1>${breed.name}</h1>
        <p>${breed.description}</p>

        <h3>Lifespan</h3>
        <p>${breed.life.min}–${breed.life.max} years</p>

        <h3>Weight</h3>
        <p>Male: ${breed.male_weight.min}–${breed.male_weight.max} kg</p>
        <p>Female: ${breed.female_weight.min}–${breed.female_weight.max} kg</p>

        <h3>Traits</h3>
        <ul>
          <li>Hypoallergenic: ${breed.hypoallergenic ? "Yes" : "No"}</li>
        </ul>
      `;
    })
    .catch(err => {
      profileContainer.textContent = "Error loading breed information.";
      console.error(err);
    });

    
}
