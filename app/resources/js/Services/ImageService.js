// storage/products/images/
//  /images/no_image.png

const ImageService = {
    getProductImageUrl: (image) => {
        if ( !image ) return 'images/no_image.png'
        return `storage/products/images/${image.filename}`
    }
}

export default ImageService
