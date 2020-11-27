# Cv

A personal cv generator.

## To use:
1. Fork or otherwise copy this repository.
2. Configure basic settings in cv.yml file, then run pipeline.

## Yaml syntax

### Top level:
Top level items are used to construct the profile. On top of the reserved keywords in the table below all following sections have their own keyword.

| Keyword    | Input syntax              | Explanation                                                                                                       |
|------------|---------------------------|-------------------------------------------------------------------------------------------------------------------|
| name       | Firstname Surname         | Name to display, only accepts two words. Required.                                                                |
| custom     | username                  | remaining items will be assumed to be name of a service with username following it. For example `gitlab: username`|

### Skills:
All children are assumed to be the name of a skill to display on CV. Default behavior is to create the skill with links to all github repositories that contain the skill name as a github "Topic". If the skill has children, they are assumed to be topic names to match with (multiple topics to match with can be assigned like this), with the exception of reserved keywords below. Note that some options do not make sense together with topic matching, and will have result in strange behaviour (cv will attempt to display both repositories and option url's)
```yaml
skills:
  - c:
    - file:
      - filename
```

| Keyword    | Input syntax              | Explanation                                                                                                       |
|------------|---------------------------|-------------------------------------------------------------------------------------------------------------------|
| text       | long string escape with ""| This will be displayed after the skill name and before matched topics.                                            |
| file       | file name to use, see ->  | Ontop of showing links to matching topics, will also have direct links to files with provided filename.           |
| rfile      | file name to use, regex   | Same as file, except string is interpreted as regex. Notice "." in regex is a special character.                  |
| url        | list of valid url         | This urls will be show in addition (or alone) to repositories, in the same way                                    |

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.7.
