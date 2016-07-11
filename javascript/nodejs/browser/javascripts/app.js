  angular.module('tradeshiftApp', [])
    .config(function($locationProvider){
      $locationProvider.html5Mode({enabled:true, requireBase: false});
    })
    .factory('$req', function ($http, $location) {
      var url = $location.absUrl(); // setting absolute URL
      return {
        getGridData: function(){
          return $http.get(url + 'demo/get_grid');
        },
        getAccountData: function(){
          return $http.get(url + 'info')
        }
      }
    })
    .controller('HomeCtrl', function ($scope, $req) {

      $scope.ui = ts.ui; // So that we can access UIC from our template
      $scope.aside = ts.ui.get('#home-aside');
      $scope.table = ts.ui.get('#home-table');
      $scope.topbar = ts.ui.get('#home-topbar');
      $scope.card = ts.ui.get('#home-card');
      $scope.showTab = 1;
      $req.getAccountData().then(function(response){
        $scope.info = response.data['ts:CompanyAccountInfo'];
        if ($scope.info){
          $scope.card.render({
            id: $scope.info['ts:CompanyAccountId'][0],
            data: {
              name: $scope.info['ts:CompanyName'] ? $scope.info['ts:CompanyName'][0] : 'none',
              location: $scope.info['ts:Country'] ? $scope.info['ts:Country'][0] : 'none',
              size: $scope.info['ts:Size'][0] ? $scope.info['ts:Size'][0] : 'none',
              connection: 0,
              industry: $scope.info['ts:Industry'] ? $scope.info['ts:Industry'][0] : 'none',
              logo: $scope.info['ts:LogoURL'] ? $scope.info['ts:LogoURL'][0] : 'none'
            }
          })
        }
      });
      $req.getGridData().then(function(response){
        $scope.data = $scope.getArray(response.data);

        /* Table */
        $scope.table // to load when data ready
          .selectable()
          .cols([
            {label: 'ID', search: {
              tip: 'Search by ID',
              onidle: function(value) {
                $scope.table.search(0, value);
              }
            }
            },
            {label: 'Character', flex: 2, wrap: true},
            {label: 'Alignment', flex: 2}
          ])
          .rows($scope.data)
          .sortable(function(index, ascending) {
            $scope.table.sort(index, ascending);
          })
          .max(3)
          .editable(function onedit(ri, ci, value){
            this.cell(ri, ci, value);
          })
          .sort(0, true);
      });
      /* Topbar */
      $scope.topbar
        .tabs([
          {
            label: 'Table',
            id: 'tab1',
            icon: 'ts-icon-apps',
            onselect : function() {
              $scope.showTab = 1;
              $scope.$apply();
              scrollTo(0,0);
            }
          },
          {
            label: 'Buttons',
            icon: 'ts-icon-activity',
            id: 'tab2',
            onselect: function() {
              $scope.showTab = 2;
              $scope.$apply(); // executing outside of angular
              scrollTo(0,0);
            }
          },
          {
            label: 'Form',
            icon: 'ts-icon-code',
            id: 'tab3',
            onselect: function() {
              $scope.showTab = 3;
              $scope.$apply();
              scrollTo(0,0);
            }
          }
        ])
        .green();

      $scope.getConfirm = function(){
        ts.ui.Dialog.confirm('Are you sure?', {
          onaccept: function() {
            ts.ui.Notification.success('You are sure.');
          },
          oncancel: function() {
            ts.ui.Notification.warning('You are not sure.');
          }
        });
      };
      /* get array of arrays from array of objects */
      $scope.getArray = function(data){
        var result = [];
        data.forEach(function(item){
          var array = [];
          for (p in item){
            array.push(item[p] + ''); // here we get array of strings
          }
          result.push(array);
        });
        return result; // array of arrays
      };
      $scope.submitForm = function(){
        ts.ui.Notification.success('Submit message :)');
      }
    });