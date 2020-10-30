# Cv

A personal cv website.

Configure basic settings in cv.yml file, then run pipeline.
### Yaml syntax:

| Keyword    | Input syntax              | Explanation                                                                                                       |
|------------|---------------------------|-------------------------------------------------------------------------------------------------------------------|
| user       | list of items             | Starts a list containing user info                                                                                |
| name       | First-name Surname        | Name to display, only accepts two words                                                                           |
| custom     | username                  | remaining items will be assumed to be name of a service with username following it. Forexample `gitlab: username` |
|------------+---------------------------+-------------------------------------------------------------------------------------------------------------------|
| skills     | list of items             | Starts a list containing skills to display                                                                        |
| custom     |                           | remaining items will be assumed to be name of a service with username following it. Forexample `gitlab: username` |
|------------+---------------------------+-------------------------------------------------------------------------------------------------------------------|




This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.7.
