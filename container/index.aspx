<%@ Page Language="C#" MasterPageFile="~/CRS.Master" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="CRS.Repairs.IndexPage" %>
<%@ MasterType VirtualPath="~/CRS.Master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <title><%= ConfigurationManager.AppSettings["ApplicationName"] %></title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <base href="<%= ConfigurationManager.AppSettings["AppBaseUrl"] %>" />
    <!-- build:css assets/bundle.css -->
    <!-- bower:css -->
    <link rel="stylesheet" href="../bower_components/components-font-awesome/css/font-awesome.css">
    <link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.min.css">
    <!-- endinject -->
    <link rel="stylesheet" type="text/css" href="../node_modules/primeui/themes/omega/theme.css" />
    <link rel="stylesheet" type="text/css" href="../node_modules/primeui/primeui-ng-all.min.css" />
    <!-- app:css -->
    <link rel="stylesheet" href="../assets/styles/main.css">
    <!-- endinject -->
    <!-- endbuild -->
    <!-- build:js assets/bundle.js -->
    <!-- bower:js -->
    <script type="text/javascript" src="../bower_components/bootstrap/dist/js/bootstrap.js"></script>
    <!-- endinject -->
    <script type="text/javascript" src="../node_modules/core-js/client/shim.min.js"></script>
    <script type="text/javascript" src="../node_modules/zone.js/dist/zone.js"></script>
    <script type="text/javascript" src="../node_modules/reflect-metadata/Reflect.js"></script>
    <script type="text/javascript" src="../node_modules/systemjs/dist/system.js"></script>
    <!-- endbuild -->
    <!-- build:remove -->
    <script type="text/javascript" src="../systemjs.config.js"></script>
    <!-- endbuild -->
    <script type="text/javascript">
    System.import('app/main.js').then(function(app) {
        var appConfig = {
            CustomerId: <%= Master.CustomerID %>,
            SiteId: <%= Master.SiteID %>,
            StationId: <%= Master.StationID %>,
            StationName: '<%= Master.StationName %>',
            StationTypeID: <%= Master.StationTypeID %>,
            StationType: '<%= Master.StationType %>',
            EventTypeId: <%= Master.EventTypeID %>,
            StatusCode: <%= Master.StatusCode %>,
            OperatorId: '<%= Master.OperatorID %>',
            OperatorName: '<%= Master.Operator %>',
            AllowDiagnostics: <%= ConfigurationManager.AppSettings["AllowDiagnostics"] %>,
            EnableActivity: <%= ConfigurationManager.AppSettings["EnableActivity"] %>,
            ApiUrls: {
                BaseUrl: '<%= ConfigurationManager.AppSettings["ApiBaseUrl"] %>'
            },
            ProductionMode: true
        };

        app.Run(appConfig);
    },
    console.error.bind(console));
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="PageHeading" runat="server"><%= ConfigurationManager.AppSettings["ApplicationName"] %></asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row" style="height: 600px;">
        <div class="container">
            <repair-app>
                <i class="center-fix main-spinner fa fa-spin fa-spinner"></i>
            </repair-app>
        </div>
    </div>
</asp:Content>