import { colors } from "./colors.js";

console.log(colors);





const settingsModal = document.querySelector(".settings-modal");
const colorsContainer = settingsModal.querySelector(".colors");
const tiersContainer = document.querySelector(".tiers");

let activetier;

//kalo di dalam tiernya ada imgnya maka imagenya kehapus maka kita perlu ngefix dengan ini 

const resetTierImages = (tier)=>{

    const images = tier.querySelectorAll(".items img");

    images.forEach((img)=>{
        document.querySelector(".cards").appendChild(img)
    })

}

//create a handle for each action  and log message 

const handleDeleteTier = () => { 
    console.log("handle delete tier");


    if(activetier){
        resetTierImages(activetier);
        activetier.remove();
        settingsModal.close();
    }
    
 }


 const handleClearTier = () => { 
    console.log("handle clear tier");

    if(activetier){
        resetTierImages(activetier);
        
        settingsModal.close();
    }
    
 }

 const handlePrependTier = () => { 
    console.log("handle prepend tier");

    if(activetier){
        tiersContainer.insertBefore(createTier() , activetier)

        settingsModal.close();

    }
    
 }


 const handleAppendTier = () => { 
    console.log("handle append tier");

    if(activetier){
        tiersContainer.insertBefore(createTier() , activetier.nextSibling)

        settingsModal.close();

    }
    
 }

//testing apakah ini berhasil atau engga dragnya 
// const handleDragOver = (event) => { 
    

//     //allow dropping 
//     event.preventDefault();
//     console.log("dragover")
//  }

const handleSettingsClick = (tier) =>{

    activetier = tier;

    //esnure selected tiers label appears in modal 

    const label = tier.querySelector(".label");

    settingsModal.querySelector(".tier-label").value = label.innerText;

    //select color 
    // pake getcomputed style untuk dapet warna label di css

    const color = getComputedStyle(label).getPropertyValue("--color");

    //pilih radio yang cocok dengan warna yang ada setelah di getcomputed
    settingsModal.querySelector(`input[value = "${color}"] `).checked = true;

    settingsModal.showModal();
}

const handleDragOver = (event) => { 
    // Allow dropping
    event.preventDefault();

    // Target the image being dragged
    const draggedImage = document.querySelector(".dragging");

    // Get the current target
    const target = event.target;

    // Allow dropping into the .items or .cards container
    if (target.classList.contains("items") || target.classList.contains("cards")) {
        target.appendChild(draggedImage);
    }

    // Allow placing the image back into the original container
    else if (target.tagName === "IMG" && target !== draggedImage) {
        const { left, width } = target.getBoundingClientRect();
        const midpoint = left + width / 2;

        if (event.clientX < midpoint) {
            target.before(draggedImage);
        } else {
            target.after(draggedImage);
        }
    }
};




 const handledrop = (event) => { 

        //prevent default browser handling 

        event.preventDefault();

        const target = event.target;

        console.log(target) //dapetin target dalam bentuk html 



        
   

}

const handleMoveTier = (tier , direction)=>{
    
    //1. tentukan siblingnya 
    const sibling = direction === "up"? tier.previousElementSibling : tier.nextElementSibling;


    //cek apakah siblingnya ada (diawal atau diakhir)
    //dan tentukan tiernya harus diletakkan sesudah atau sebelum sibling
    if(sibling){

        const position = direction === "up"? "beforebegin" : "afterend";
        sibling.insertAdjacentElement(position , tier)


    }
}


//nfn shortuct to make this 
const createTier = (label = 'Change me' ) => { 

    const tierColor = colors[tiersContainer.children.length % colors.length];

    
    const tier  = document.createElement("div");
    tier.className = "tier";

    tier.innerHTML = `
    <div class="label" contenteditable="plaintext-only" style="--color: ${tierColor}">
    <span>${label}</span>
    </div>
    <div class="items"></div>
    <div class="controls">
    <button class="settings"><i class="bi bi-gear-fill"></i></button>
    <button class="moveup"><i class="bi bi-chevron-up"></i></button>
    <button class="movedown"><i class="bi bi-chevron-down"></i></button>
  </div>`;

  //attach event listeners
  
  //target settingsnya yang bakal jadi pop up 

  tier.querySelector(".settings").addEventListener("click" , ()=> handleSettingsClick(tier))



  //handle naik turun dengan ngetarget panahannya 
  tier.querySelector(".movedown").addEventListener("click" , ()=> handleMoveTier(tier , "down"))
  tier.querySelector(".moveup").addEventListener("click" , ()=> handleMoveTier(tier , "up"))


  //hanlde drag dan drop 

  tier.querySelector(".items").addEventListener("dragover" , handleDragOver)
  tier.querySelector(".items").addEventListener("drop" , handledrop)

  //bisa diletakin di container cardnya balik
  document.querySelector(".cards").addEventListener("dragover", handleDragOver);


  return tier;



}

const initcoloroptions  = ()=>{

    colors.forEach((color)=>{
        const label = document.createElement("label");
        label.style.setProperty("--color" , color);
        label.innerHTML = `<input type="radio" name="color" value="${color}" />`;
        colorsContainer.appendChild(label)
    })
}

const initDefaultTierList = ()=>{
    ['S' , 'A' , 'B' , 'C' , 'D'].forEach((label)=>{
        tiersContainer.appendChild(createTier(label))
    })
}


const initDraggables = () => { 

    const images = document.querySelectorAll(".cards img")
    images.forEach((img) => { 

        img.draggable = true;


        //bikin fade 
        img.addEventListener("dragstart" , ()=>{
            img.classList.add("dragging")
        })

        img.addEventListener("dragend" , ()=>{
            img.classList.remove("dragging")
        })


     })
 }

 initDraggables();
initDefaultTierList();
initcoloroptions();



//show modal (popup)
// settingsModal.showModal();


//event listener 

document.querySelector("h1").addEventListener("click" , ()=> {
    tiersContainer.appendChild(createTier());


})

//ketika background diclick maka kita akan close popup
settingsModal.addEventListener("click" , (event)=>{

    //pastikan modalnya yang trigger bukan elemen didalamnya 

    if(event.target === settingsModal){
        settingsModal.close();
    }

    //jika bukan settingsmodal melainkan elemen didalamnya 

    else{

        const action = event.target.id;
        console.log(action);

        const actionMap = {
            delete: handleDeleteTier,
            clear: handleClearTier,
            prepend: handlePrependTier,
            append: handleAppendTier
        }

        //check if clicked element corresponds to a valid action

        if(action && actionMap[action]){

            actionMap[action]();
        }


        
        
    }
})

//fungsi untuk edit tier colors dan labels

settingsModal.querySelector(".tier-label").addEventListener("input" , (event)=>{

    //kita perlu cek tier yang aktif dengan let active tier diatas 

    if(activetier){
        activetier.querySelector(".label span").textContent = event.target.value;

    }

    
})

//handle perubahan warna 

colorsContainer.addEventListener("change" , (event) =>{
    if(activetier){


        activetier.querySelector(".label").style.setProperty("--color" , event.target.value

        )
    }
})


//kalo settings modalnya close reset tier active

settingsModal.addEventListener("close" , ()=> activetier = null)