# Contributing

## Setup

Clone the repository:
```
git clone https://github.com/Microsoft/powerbi-router
```

Install global dependencies if needed:
```
npm install -g typescript gulp typings
```

Install local dependencies:
```
typings install
npm install
```

## Building
```
gulp build
```
Or if using VSCode: `Ctrl + Shift + B`

## Testing
```
npm test
```
or use gulp directly:
```
gulp test
```

Run tests with Chrome and close when finished
```
gulp test --debug
```

Run tests with Chrome and remain open for debugging
```
gulp test --debug --watch
```