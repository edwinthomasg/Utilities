const { readFile, readdir, writeFile } = require("fs").promises
const frontMatter = require("gray-matter")
const os = require("os")
const path = require("path")
const axios = require("axios")
const { createContent, updateContent } = require("./helpers/fileTask")

const templatesPath = "/Desktop/hugo-project/templates"
const contentPath = "/Desktop/hugo-project/content"
const dataSource = path.join(os.homedir(), templatesPath )
const contentSource = path.join(os.homedir(), contentPath )

//Modifying the frontmatter and body of a markdown file
const updateMarkdownFile = async(dataSource, file) => {
        const data = await readFile(path.join(dataSource, file), {encoding: "utf-8"})
        let { content, data: matter } = frontMatter(data)
        let updatedContent = updateContent(content, matter)
      
        //update at templates folder
        await writeFile(path.join(dataSource, file), updatedContent)
        .then(() => console.log(`${file} updated successfully`))
        .catch(() => console.log("error in updating the file"))

        //write file to content folder
        await writeFile(path.join(contentSource, file), updatedContent)
        .then(() => console.log(`${file} created successfully to content folder`))
        .catch(() => console.log("error in writing the file to content folder"))
}

//Getting all the markdown files under templates
const markdownFiles = async() => {
    const data = await readdir(dataSource, {withFileTypes: true})
    let files = data.map(file => file.isFile() && file.name.endsWith(".md") && file.name)
    await Promise.all(files.map(file => updateMarkdownFile(dataSource, file)))
}

markdownFiles()
 
const generateDynamicFile = async() => {
    const response = await axios.get("https://mocki.io/v1/e218ea88-d34d-4630-8480-7af0588afdfd")
    const { body, frontmatter } = response.data
    let file = frontmatter.title.split(" ").join("-")+".md"
    const markdownContent = createContent(body, frontmatter)
    await writeFile(path.join(dataSource, file), markdownContent)
    .then(() => {
      console.log(`${file} created successfully to content folder`)
    })
    .catch(() => {
        console.log("error in creating the file")
    })
    await writeFile(path.join(contentSource, file), markdownContent)
    .then(() => {
      console.log(`${file} created successfully to content folder`)
    })
    .catch(() => {
        console.log("error in creating the file")
    })
}

generateDynamicFile()













// let date = new Date()
// if(err) throw err
// let md = fm(data)
// // console.log(date)
// md.body = `This content was edited at ${date}`
// console.log(md.attributes)
// Object.assign(md.attributes, { editedAt: date})
// console.log(md)