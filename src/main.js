import './style.css'
import images_data from './images_data.js'
import { animate } from 'animejs';

// Declaring variables for HTML Elements
const image_element = document.getElementById('picture');
const score_element = document.getElementById('score');
const button_a = document.getElementById('button_a');
const button_b = document.getElementById('button_b');
const category_dial = document.getElementById('category_dial');
const cat_a = document.getElementById('cat_a');
const cat_b = document.getElementById('cat_b');
const start_dial = document.getElementById('start_dial');
const start_btn = document.getElementById('start_btn');
const gameover_dial = document.getElementById('gameover_dial');
const gameover_msg = document.getElementById('gameover_msg');
const gameover_btn = document.getElementById('gameover_btn');

// Source : https://bost.ocks.org/mike/shuffle/
// Shuffles a list
function shuffle(array) {
  var copy = [], n = array.length, i;

  // While there remain elements to shuffle…
  while (n) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * array.length);

    // If not already shuffled, move it to the new array.
    if (i in array) {
      copy.push(array[i]);
      delete array[i];
      n--;
    }
  }

  return copy;
}

function create_image_set(images_data) {

  const categories = ['A', 'B', 'C', 'D','E', 'F', 'G'];
  let image_set = [];

  for (const i in categories) {

    let cat_images = images_data.filter(function(item){
      return item.category == categories[i];         
    });

    let cat_a = cat_images.filter(function(item){
      return item.tag == 'a';
    })

    let cat_b = cat_images.filter(function(item){
      return item.tag == 'b';
    })

    cat_a = shuffle(cat_a).slice(0,5);
    cat_b = shuffle(cat_b).slice(0,5);

    shuffle(cat_a.concat(cat_b)).forEach(img => {
      image_set.push(img)
    });
  }

  return image_set;
}

let score = 0;
const image_set = create_image_set(images_data)

const labels = {
    'A': ['Chihuahua', 'Muffin'],
    'B': ['Banane', 'Canard'],
    'C': ['Abeille', 'Pain à l\'ail'],
    'D': ['Guacamole', 'Perroquet'],
    'E': ['Dalmatien', 'Glace'],
    'F': ['Noix de Coco', 'Paresseux'],
    'G': ['Chat', 'Pain Pita']}

// Show the first image
let current_image = image_set[0];
image_element.src = current_image.path;
let last_category = current_image.category
let image_index = 1;

function check_image(key) {
  // if (key === 'a' || key === 'b' ) {
  if (key === current_image.tag) {
    score++;
    score_element.textContent = score;
  }
  
  current_image = image_set[image_index];
  console.log(current_image);
  image_element.src = current_image.path;
  //Labels the buttons
  let category = current_image.category;
  button_a.innerHTML = labels[category][0];
  button_b.innerHTML = labels[category][1];
  if (category != last_category) {
    cat_a.innerHTML = labels[category][0];
    cat_b.innerHTML = labels[category][1];
    open_modal(category_dial);
    animate( category_dial, {
      scale: [0, 1.5],
      opacity: [0, 0.85],
      duration: 500,
      easing: 'easeOutCubic'
    });
    setTimeout(() => {close_modal(category_dial) }, 1000);
  }
  last_category = category
  //increment image index
  image_index++;
    
  // }

  if (image_index === image_set.length) {
    gameover_msg.innerHTML = `Bravo, tu as reconnu ${score} images`;
    setTimeout(() => {open_modal(gameover_dial)}, 200);  
  }
}

// function reset_game() {
//   score = 0;
//   score_element.textContent = score;
//   image_index = 0;
//   const new_image_set = create_image_set(images_data);
//   current_image = new_image_set[image_index];
//   image_element.src = current_image.path;
//   last_category = current_image.category;

//   let category = current_image.category;
//   button_a.innerHTML = labels[category][0];
//   button_b.innerHTML = labels[category][1];
// }

button_a.addEventListener('click', (event) => {
  check_image('a');
});
button_b.addEventListener('click', (event) => {
  check_image('b');
});

document.addEventListener('keypress', (event) => {
  const key = event.key.toLowerCase();
  if (start_dial.classList.contains('hidden')) {

    if (key === 'a') {
      
      button_a.classList.add('animate-ping')
      setTimeout(() => {button_a.classList.remove('animate-ping')
      }, 50);

      setTimeout(() => {check_image(key);}, 100); 

    } else if (key === 'b'){
      button_b.classList.add('animate-ping')
      setTimeout(() => {button_b.classList.remove('animate-ping')
      }, 50);

      setTimeout(() => {check_image(key);}, 100); 
    }
   
  }

  // Trigger Start button on key press
  if (start_dial.classList.contains('hidden') != true) {
    animate( start_btn, {
        scale: [0.7, 2],
        opacity: [1, 0.5],
        duration: 500,
        easing: 'easeOutCubic'
      });
    setTimeout(() => {close_modal(start_dial)}, 300);
  }

  // Trigger Game Over button on key press
  if (gameover_dial.classList.contains('hidden') != true) {
    animate( gameover_btn, {
        scale: [0.7, 2],
        opacity: [1, 0],
        duration: 500,
        easing: 'easeOutCubic'
      });
    setTimeout(() => {location.reload()}, 300);   
  }
});

start_btn.addEventListener('click', (event) => {
  animate( start_btn, {
        scale: [0.7, 2],
        opacity: [1, 0.5],
        duration: 500,
        easing: 'easeOutCubic'
      });
    setTimeout(() => {close_modal(start_dial)}, 300); 
});

gameover_btn.addEventListener('click', (event) => {
  animate( gameover_btn, {
        scale: [0.7, 2],
        opacity: [1, 0],
        duration: 500,
        easing: 'easeOutCubic'
      });
  setTimeout(() => {location.reload()}, 300);
  // reset_game();
  // open_modal(start_dial);
  // close_modal(gameover_dial);
});

function open_modal(modal_elem) {
      modal_elem.classList.remove('hidden');
}
function close_modal(modal_elem) {
      modal_elem.classList.add('hidden');
}