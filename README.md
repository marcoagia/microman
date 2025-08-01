# microman

**microman** is a powerful CLI tool that scaffolds new microservices using popular backend technologies, and automatically integrates them into your project’s Docker Compose setup.  
Use it to quickly expand and organize your microservice-based architecture!

---

## Features

- ✅ Scaffold microservices with extensible backends (Node.js/Express, Python/FastAPI, etc.)
- ✅ Automatically updates your `docker-compose.yml`
- ✅ Custom templates via simple extension interface
- ✅ Ready for CI/CD integration

---

## Getting Started

### 1. Create a new microservice

Run directly via `npx`:

```bash
npx microman new
```

You will be guided through naming your microservice and selecting its technology.  
The tool creates code, Dockerfiles, environment files, and updates `docker-compose.yml` for you.

---

### 2. Install globally (optional)

If you prefer, install globally:

```bash
npm install -g microman
microman new
```

---

## Usage

#### Scaffold a microservice

```bash
npx microman new
```

- You are prompted for a name and the backend technology.
- All boilerplate and Docker integration is handled for you!

---

## Extending

### Add a new technology

Create a new extension in `src/extensions/`, implementing the `MicroserviceExtension` interface.  
Then, register your extension in the main manager (see the existing code for examples).

PRs for new technologies, improvements, and bug-fixes are welcome!

---

## Contributing

We welcome contributions!  
To get started:

1. **Fork** this repository
2. Create your feature branch:  
   `git checkout -b feat/your-feature`
3. Commit your changes:  
   `git commit -am 'Add some feature'`
4. Push to the branch:  
   `git push origin feat/your-feature`
5. Open a **pull request**

**Issues and suggestions:**  
Please [open an issue](https://github.com/marcoagia/microman/issues) for bugs, feature requests, or questions.

**Coding style:**  
- TypeScript, with `strict` enabled
- Separate extensions in their own files under `src/extensions/`
- Use clear, readable commit messages

---

## License

MIT © marcoagia

---

**Happy scaffolding!** 🎉

---
