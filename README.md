# React Native Expo Mobile Application 
This is a fullstack expense-tracker cross-platform mobile application.

## Development notes:
- To use values from `.env` file, we need to use the `dotenv.config()`, from the package.
- Database used: Postgres SQL via neondb 
- No ORM used, only the using Raw SQL.
- taggged template litral to call function
- Clerk user management platform for managing auth and related stuff.
### new concept learnt 
1. Tagged template litral function call
```js
const fn = (x) => {
    // some function that accepts string as the parameter
}
//conventional way of calling:
fn("Hello World");
// Tagged litral way of calling:
fn`Hello World`
```
2. Process exit code

```js
try{
//...
}catch(e){
//...
    process.exit(1)
}
```
