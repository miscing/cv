"use strict";
//
// Copyright 2020 Alexander Saastamoinen
//
//  Licensed under the EUPL, Version 1.2 or – as soon they
// will be approved by the European Commission - subsequent
// versions of the EUPL (the "Licence");
//  You may not use this work except in compliance with the
// Licence.
//  You may obtain a copy of the Licence at:
//
//  https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
//
//  Unless required by applicable law or agreed to in
// writing, software distributed under the Licence is
// distributed on an "AS IS" basis,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied.
//  See the Licence for the specific language governing
// permissions and limitations under the Licence.
//
exports.__esModule = true;
exports.SkillOption = exports.Skill = exports.Lang = exports.AboutExtra = exports.About = exports.Link = exports.Profile = exports.Cv = void 0;
var Cv = /** @class */ (function () {
    function Cv() {
    }
    return Cv;
}());
exports.Cv = Cv;
var Profile = /** @class */ (function () {
    function Profile() {
        this.links = [];
    }
    return Profile;
}());
exports.Profile = Profile;
var Link = /** @class */ (function () {
    function Link() {
    }
    return Link;
}());
exports.Link = Link;
var About = /** @class */ (function () {
    function About() {
        this.text = [];
    }
    return About;
}());
exports.About = About;
var AboutExtra = /** @class */ (function () {
    function AboutExtra(key, value) {
        this.key = key;
        this.value = value;
    }
    return AboutExtra;
}());
exports.AboutExtra = AboutExtra;
var Lang = /** @class */ (function () {
    function Lang(name, level) {
        this.name = name;
        this.level = level;
    }
    return Lang;
}());
exports.Lang = Lang;
var Skill = /** @class */ (function () {
    function Skill() {
    }
    return Skill;
}());
exports.Skill = Skill;
// contains option information for parsing of skills
var SkillOption = /** @class */ (function () {
    function SkillOption() {
    }
    return SkillOption;
}());
exports.SkillOption = SkillOption;
// export class Timeline {
// 	dates :Moment[];
// }
// export class Moment {
// 	date :Date;
// 	event :string; //text to show, for example "Started as account handler at Company A"
// }
