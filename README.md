# Cv

A personal cv website.

Configure basic settings in cv.yml file, then run pipeline.
## Yaml syntax

### User:
Children items may user:
| Keyword    | Input syntax              | Explanation                                                                                                       |
|------------|---------------------------|-------------------------------------------------------------------------------------------------------------------|
| name       | Firstname Surname         | Name to display, only accepts two words. Required                                                                 |
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
| text       | long string escape with ""| This will be displayed after the skill name and before matched topics                                             |
| file       | file name to use, see ->  | Will remove default behavior, instead showing links to all files in user repositories matching input              |
| rfile      | file name to use, regex   | Same as file, except string is interpreted as regex. Notice "." in regex is a special character                   |

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.7.
