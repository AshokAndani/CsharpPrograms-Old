// --------------------------------------------------------------------------------------------------------------------
// <copyright file=Account.cs" company="Bridgelabz">
//   Copyright � 2020 Company="BridgeLabz"
// </copyright>
// <creator Name="ASHOKKUMAR"/>
// --------------------------------------------------------------------------------------------------------------------
namespace CommercialDataProcessing
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using Newtonsoft.Json;
    /// <summary>
    /// this class manages the StockAccounts class
    /// </summary>
    public class AccountManagement
    {
       private static string  path = @"D:\WindowsProjects\ObjectOrientedProgramming\ObjectOrientedProgramming\CommercialDataProcessing\Accounts.json";