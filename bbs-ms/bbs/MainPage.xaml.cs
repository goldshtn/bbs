using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using Microsoft.WindowsAzure.MobileServices;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

namespace bbs
{    
    public class Message
    {
        public int Id { get; set; }

        [DataMember(Name = "User")]
        public string User { get; set; }

        [DataMember(Name = "Text")]
        public string Text { get; set; }
    }

    public sealed partial class MainPage : Page
    {
        // MobileServiceCollectionView implements ICollectionView (useful for databinding to lists) and 
        // is integrated with your Mobile Service to make it easy to bind your data to the ListView
        private MobileServiceCollectionView<Message> items;

        private IMobileServiceTable<Message> messagesTable = App.MobileService.GetTable<Message>();

        public MainPage()
        {
            this.InitializeComponent();
        }

        private async void InsertMessage(Message todoItem)
        {
            await messagesTable.InsertAsync(todoItem);
            items.Add(todoItem);                        
        }

        private void RefreshMessages()
        {
            items = messagesTable.ToCollectionView();
            ListItems.ItemsSource = items;
        }

        private void ButtonRefresh_Click(object sender, RoutedEventArgs e)
        {
            RefreshMessages();
        }

        private void ButtonSave_Click(object sender, RoutedEventArgs e)
        {
            var todoItem = new Message { User = "Sasha", Text = TextInput.Text };
            InsertMessage(todoItem);
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            RefreshMessages();
        }
    }
}
