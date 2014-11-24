/*
ng-Choice Directive
===================

Dropdown with images and single menu item for angular

By Walter Staeblein (wstaeblein)

Distributed under the MIT Licence

*/
(function() {
    var app = angular.module('ngChoice', ['ngAnimate']);


    app.directive('choice', [ '$document', function($document) {

        return {
            restrict: 'E',
            scope: {
                model: '=ngModel',
                list: '='
            },
            template: '<div class="chc_main">' +
                            '<div ng-class="{ chc_box: !isMenu, chc_menu: isMenu }" ng-click="openList($event)">' +

                                '<table cellpadding="5" cellspacing="0" class="chc_header">' +
                                '<tr><td ng-if="useimg" class="chc_img"><img ng-src="{{ chosenImage() }}" /></td>' +
                                '<td class="chc_text">' +
                                '<table class="chc_fixed"><tr><td ng-class="{ chc_placeholder: isPlaceHolder }">{{ chosenText() }}</td></tr></table>' +
                                '</td>' +
                                '<td class="chc_arrow"><span></span></td></tr></table>' +

                            '</div>' +
                            '<ul class="chc_list chcList-animation" ng-show="showList" ng-class="{ chc_menu: isMenu }">' +
                                '<li ng-repeat="l in list | orderBy: order" ng-click="select(l);">' +
                                    '<div class="chc_img" ng-if="useimg"><img ng-src="{{ l.img }}" /><span></span></div>' +
                                    '<div class="chc_text">{{ l.text }}</div>' +
                                '</li>' +
                            '</ul>' +
                        '</div>',

            compile: function(element, attributes) {

                return function($scope, element, attr) {

                    var clickflag = false;  // Controla o click que abre a lista clicada e fecha qq outra lista aberta
                    $scope.showList = false;
                    $scope.isMenu = (attr.menu && attr.menu != '' && attr.menu != 'false');
                    
                    if ($scope.isMenu) {
                        $scope.useimg = (attr.titleimg != undefined && attr.titleimg != '');
                    } else {
                        $scope.useimg = ($scope.list && $scope.list[0].img != undefined);
                    }
                    
                    if (!isNaN(attr.sortdir) && (attr.sortdir == 1 || attr.sortdir == -1)) {
                        $scope.order = (attr.sortdir == -1 ? '-' : '') + 'text';
                    }

                    $scope.isPlaceHolder = false;
                    $scope.title = attr.title || '\xA0';

                    var objEle = $(element).find('.chc_main'); 

                    if (attr.width) { 
                        objEle.find('> div').width(attr.width); 
                    } else {
                        objEle.find('.chc_fixed').width('auto');
                    }

                    $document.on('click', function($event) { 
                        $scope.$apply(function() {
                            // Só fecha a lista se o evento for de uma lista não clicada
                            if (!clickflag) { $scope.showList = false; }
                            clickflag = false;  // Reseta o flag
                        })
                    });

                    $scope.chosenImage = function() {
                        return $scope.isMenu ? attr.titleimg : ($scope.model ? $scope.model.img : '');
                    }
                    $scope.chosenText = function() {

                        $scope.isPlaceHolder = false;
                        if ($scope.isMenu) {
                            return $scope.title || '\xA0';
                        } else {
                            if ($scope.model) {
                                return $scope.model.text || '\xA0';
                            } else {
                                $scope.isPlaceHolder = true;
                                return $scope.title || '\xA0';
                            }
                        }
                    }

                    $scope.select = function(litem) {
                        $scope.model = litem;
                    }

                    $scope.openList = function(evt) { 
                        clickflag = true;   // Seta o flag para avisar que esta lista deve ficar aberta
                        $(element).find('ul.chc_list').css('top', objEle.outerHeight(true) );

                        $scope.showList = !$scope.showList;
                    }
                }
            }

        }

    }]);

})();