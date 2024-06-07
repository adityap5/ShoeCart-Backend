const Category = require('../models/categorymodel');
const Product = require('../models/productmodel');
async function createProduct(reqData){
    let topLevel = await Category.findOne({name: reqData.topLevelCategory});
    if(!topLevel){
        topLevel =new Category({
            name:reqData.topLevelCategory,
            level:1
        })
    }
    let secondLevel = await Category.findOne({name: reqData.secondLevelCategory,parentCategory:topLevel._id});
    if(!secondLevel){
        secondLevel =new Category({
            name:reqData.secondLevelCategory,
            parentCategory:topLevel._id,
            level:2
        })
    }
    let thirdLevel = await Category.findOne({name: reqData.thirdLevelCategory,parentCategory:secondLevel._id});
    if(!thirdLevel){
        thirdLevel =new Category({
            name:reqData.thirdLevelCategory,
            parentCategory:secondLevel._id,
            level:3
        })
    }

    const product = new Product({
        title:reqData.title,
        color:reqData.color,
        description:reqData.description,
        disscountedPrice:reqData.disscountedPrice,
        disscountPercent:reqData.disscountPercent,
        imageUrl:reqData.imageUrl,
        brand:reqData.brand,
        price:reqData.price,
        sizes:reqData.size,
        quantity:reqData.quantity,
        category:thirdLevel._id

    })

    return await product.save();

}
async function deleteProduct(productId){
    const product = await findProductById(productId);
    await product.findByIdAndDelete(productId);
    return "Product deleted Successfully"

}
async function updateProduct(productId,reqData){
    return await Product.findByIdAndUpdate(productId,reqData);
}
async function findProductById(id){
    const product = await Product.findById(id).populate("category").exec();

    if(!product){
        throw new Error("Product not found with id " + id);
    }
    return product;
}
async function getAllProducts(reqQuery){
   let {category,color,sizes,minPrice,maxPrice,minDisscount,sort,pageNumber,pageSize} = reqQuery;

   pageSize = pageSize || 10;
   let query = Product.find().populate("category");
   if(category){
    const existCategory = await Category.findOne({name: category});
    if(existCategory){
        query =query.where("category").equals(existCategory._id);
    }else{
        return {content:[],currentPage:1,totalPages:0}
    }
   }
   if(color){
    const colorSet = new Set(color.split(",").map(color=>color.trim().toLowerCase()));

    const colorRegex=colorSet.size>0?new RegExp([...colorSet].join("|"),"i"):null;

    query=query.where("color").regex(colorRegex);
   }
   if(sizes){
    const sizeSet=new Set(sizes);
    query=query.where("sizes.name").in([...sizeSet])
   }
   if(minPrice && maxPrice){
    query=query.where("disscoutedPrice").gte(minPrice).lte(maxPrice);
   }
   if(minDisscount){
    query=query.where("disscoutPercent").gt(minDisscount)
   }
   if(stock){
    if(stock==="in_stock"){
        query=query.where("quantity").gt(0)
    }else if(stock==="out_stock"){
        query=query.where("quantity").gt(1);
    }
   }
   if(sort){
    const sortDirection =sort==="price_high"?-1:1;
    query=query.sort({disscountedPrice:sortDirection})
   }
   const totalProducts=await Product.countDocuments(query);
   const skip=(pageNumber-1)*pageSize;
   query=query.skip(skip).limit(pageSize);
   const products = await query.exec();
   const totalPages = Math.ceil(totalProducts/pageSize);

   return {content:products,currentPage:pageNumber,totalPages:totalPages}

}
async function createMultipleProduct(products){
    for(let product of products){
        await createProduct(product);
    }
}

module.exports={createProduct,deleteProduct,createMultipleProduct,updateProduct,findProductById,getAllProducts}