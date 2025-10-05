import { useEffect, useState } from "react"
import { LoadImage } from "../../wailsjs/go/main/App"

const ImagemView =()=>{
    const [src,setSrc]=useState('')

    useEffect(()=>{
        const fetchImage=async()=>{
            const img = await LoadImage("teste.png")
        setSrc(img)
        }
        fetchImage()
    },[])
  



return(
    // no JSX
<img src={src} alt="imagem" />
)

}
export default ImagemView




// import { SaveImage } from "../../wailsjs/go/main/App"

// async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
//   const file = e.target.files?.[0]
//   if (!file) return

//   const reader = new FileReader()
//   reader.onload = async () => {
//     const base64 = reader.result as string
//     await SaveImage(base64, "C:/imagens/upload.png")
//   }
//   reader.readAsDataURL(file)
// }
