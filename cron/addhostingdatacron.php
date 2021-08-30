<?php
$base_url = "https://azpire-hosting.com/api";
$token = "BA6A77233776A92C8FEB3BA54CAD2820";

//Create MySQl Connection
$db_handle  = mysqli_connect('localhost','azpire_azh_prod_usr','Aq2LaSRi7!3@');

// Check connection
if ( !$db_handle ) {
    die("Connection failed: " . mysqli_connect_error());
}

mysqli_select_db($db_handle, 'azpire_azh_prod');

//Add Domains to DB
$table = "Domains";
$query_key = "tld";
$response = file_get_contents("$base_url/domain-price?token=$token");
$domains = json_decode($response);

foreach ($domains as $domain) {
    $query = "SELECT id FROM $table where $query_key='$domain->tld'";
    $run_query = mysqli_query($db_handle,$query);
    $result = mysqli_fetch_array($run_query);
    $date = date('Y-m-d H:i:s', time());
    
    if (!$result){
        $query = "INSERT INTO $table(tld, final_cost, renewal_cost, createdAt, updatedAt) VALUES ('$domain->tld', '$domain->final_cost', '$domain->renewal_cost', '$date', '$date' );";
        $result = mysqli_query($db_handle,$query);
        if (!$result){
            echo "Adding record $domain->tld failed to table $table <br>";
        }else{
            echo "Successfully added Record with id $id to $table <br> ";
        }
    }else{
        $id = $result['id'];
        $query = "UPDATE $table SET final_cost='$domain->final_cost', renewal_cost='$domain->renewal_cost', updatedAt='$date' WHERE id=$id;";
        $result = mysqli_query($db_handle,$query);
        if (!$result){
            echo "Updating $domain->tld record in $table failed <br>";
        }else{
            echo "Successfully updated Record $domain->tld to $table <br> ";
        }
    }
}


//Add Shared Hosting Plans to DB
$table = "SharedHostingPlans";
$query_key = "product_name";
$response = file_get_contents("$base_url/shared-hosting-price?token=$token");
$shared_hosting_plans = json_decode($response);

foreach ($shared_hosting_plans as $shared_hosting_plan) {
    $query = "SELECT id FROM $table where $query_key='$shared_hosting_plan->product_name'";
    $run_query = mysqli_query($db_handle,$query);
    $result = mysqli_fetch_array($run_query);
    $date = date('Y-m-d H:i:s', time());
    
    if (!$result){
        $query = "INSERT INTO $table(hosting_type,product_name,my_custom_product_name,final_cost, monthly_cost,diskspace,bandwidth,dedicated_ip,backups,hosted_domains,sub_domains,email_accounts,email_per_hour,createdAt,updatedAt) VALUES ('$shared_hosting_plan->hosting_type','$shared_hosting_plan->product_name','$shared_hosting_plan->my_custom_product_name','$shared_hosting_plan->final_cost','$shared_hosting_plan->final_monthly_cost','$shared_hosting_plan->diskspace','$shared_hosting_plan->bandwidth','$shared_hosting_plan->dedicated_ip','$shared_hosting_plan->backups','$shared_hosting_plan->hosted_domains','$shared_hosting_plan->sub_domains','$shared_hosting_plan->email_accounts','$shared_hosting_plan->email_per_hour','$date','$date' );";
        $result = mysqli_query($db_handle,$query);
        if (!$result){
            echo "Adding record $shared_hosting_plan->product_name failed to table $table <br>";
        }else{
            echo "Successfully added Record with id $id to $table <br> ";
        }
    }else{
        $id = $result['id'];
        $query = "UPDATE $table SET product_name='$shared_hosting_plan->product_name',my_custom_product_name='$shared_hosting_plan->my_custom_product_name', final_cost='$shared_hosting_plan->final_cost', monthly_cost='$shared_hosting_plan->final_monthly_cost',diskspace='$shared_hosting_plan->diskspace',bandwidth='$shared_hosting_plan->bandwidth', dedicated_ip='$shared_hosting_plan->dedicated_ip',backups='$shared_hosting_plan->backups', hosted_domains='$shared_hosting_plan->hosted_domains',sub_domains='$shared_hosting_plan->sub_domains',email_accounts='$shared_hosting_plan->email_accounts',email_per_hour='$shared_hosting_plan->email_per_hour', updatedAt='$date' WHERE id=$id;";
        $result = mysqli_query($db_handle,$query);
        if (!$result){
            echo "Updating $shared_hosting_plan->product_name record in $table failed <br>";
        }else{
            echo "Successfully updated Record $vps_hosting_plan->product_name to $table <br> ";
        }
    }
}



//Add VPS Hosting to DB
$table = "VpsHostingPlans";
$query_key = "product_name";
$response = file_get_contents("$base_url/vps-price?token=$token");
$vps_hosting_plans = json_decode($response);

foreach ($vps_hosting_plans as $vps_hosting_plan) {
    $query = "SELECT id FROM $table where $query_key='$vps_hosting_plan->product_name'";
    $run_query = mysqli_query($db_handle,$query);
    $result = mysqli_fetch_array($run_query);
    $date = date('Y-m-d H:i:s', time());
    
    if (!$result){
        $query = "INSERT INTO $table(hosting_type,product_name,my_custom_product_name,final_cost,cores,ram,diskspace,bandwidth,dedicated_ip,mbit,createdAt,updatedAt) VALUES ( '$vps_hosting_plan->hosting_type', '$vps_hosting_plan->product_name', '$vps_hosting_plan->my_custom_product_name', '$vps_hosting_plan->final_cost', '$vps_hosting_plan->cores', '$vps_hosting_plan->ram', '$vps_hosting_plan->diskspace', '$vps_hosting_plan->bandwidth', '$vps_hosting_plan->dedicated_ip', '$vps_hosting_plan->mbit', '$date', '$date' );";
        $result = mysqli_query($db_handle,$query);
        if (!$result){
            echo "Adding record $vps_hosting_plan->product_name failed to table $table <br>";
        }else{
            echo "Successfully added Record $vps_hosting_plan->product_name to $table <br> ";
        }
    }else{
        $id = $result['id'];
        $query = "UPDATE $table SET product_name='$vps_hosting_plan->product_name',my_custom_product_name='$vps_hosting_plan->my_custom_product_name',final_cost='$vps_hosting_plan->final_cost',cores='$vps_hosting_plan->cores',ram='$vps_hosting_plan->ram',diskspace='$vps_hosting_plan->diskspace',bandwidth='$vps_hosting_plan->bandwidth',dedicated_ip='$vps_hosting_plan->dedicated_ip',mbit='$vps_hosting_plan->mbit', updatedAt='$date' WHERE id=$id;";
        $result = mysqli_query($db_handle,$query);
        if (!$result){
            echo "Updating $vps_hosting_plan->product_name record in $table failed <br>";
        }else{
            echo "Successfully updated Record with id $id to $table <br> ";
        }
    }
}


//Add VPS Cloud Hosting to DB
$table = "VpsCloudHostingPlans";
$query_key = "product_name";
$response = file_get_contents("$base_url/vps-cloud-price?token=$token");
$vps_cloud_hosting_plans = json_decode($response);

foreach ($vps_cloud_hosting_plans as $vps_cloud_hosting_plan) {
    $query = "SELECT id FROM $table where $query_key='$vps_cloud_hosting_plan->product_name'";
    $run_query = mysqli_query($db_handle,$query);
    $result = mysqli_fetch_array($run_query);
    $date = date('Y-m-d H:i:s', time());
    
    if (!$result){
        $query = "INSERT INTO $table(hosting_type, product_name, my_custom_product_name, final_cost, cores, ram, diskspace, bandwidth, dedicated_ip, mbit, createdAt, updatedAt) VALUES ('$vps_cloud_hosting_plan->hosting_type', '$vps_cloud_hosting_plan->product_name', '$vps_cloud_hosting_plan->my_custom_product_name', '$vps_cloud_hosting_plan->final_cost', '$vps_cloud_hosting_plan->cores', '$vps_cloud_hosting_plan->ram', '$vps_cloud_hosting_plan->diskspace', '$vps_cloud_hosting_plan->bandwidth', '$vps_cloud_hosting_plan->dedicated_ip', '$vps_cloud_hosting_plan->mbit', '$date', '$date' );";
        $result = mysqli_query($db_handle,$query);
        if (!$result){
            echo "Adding record $vps_cloud_hosting_plan->product_name failed to table $table <br>";
        }else{
            echo "Successfully added Record $vps_cloud_hosting_plan->product_name to $table <br> ";
        }
    }else{
        $id = $result['id'];
        $query = "UPDATE $table SET product_name='$vps_cloud_hosting_plan->product_name',my_custom_product_name='$vps_cloud_hosting_plan->my_custom_product_name',final_cost='$vps_cloud_hosting_plan->final_cost',cores='$vps_cloud_hosting_plan->cores',ram='$vps_cloud_hosting_plan->ram',diskspace='$vps_cloud_hosting_plan->diskspace',bandwidth='$vps_cloud_hosting_plan->bandwidth',dedicated_ip='$vps_cloud_hosting_plan->dedicated_ip',mbit='$vps_cloud_hosting_plan->mbit', updatedAt='$date' WHERE id=$id;";
        $result = mysqli_query($db_handle,$query);
        if (!$result){
            echo "Updating $vps_cloud_hosting_plan record in $table failed <br>";
        }else{
            echo "Successfully updated Record with id $id to $table <br> ";
        }
    }
}


//Add Dedicated Hosting to DB
$table = "DedicatedHostingPlans";
$query_key = "product_name";
$response = file_get_contents("$base_url/ded-price?token=$token");
$dedicated_hosting_plans = json_decode($response);

foreach ($dedicated_hosting_plans as $dedicated_hosting_plan) {
    $query = "SELECT id FROM $table where $query_key='$dedicated_hosting_plan->product_name'";
    $run_query = mysqli_query($db_handle,$query);
    $result = mysqli_fetch_array($run_query);
    $date = date('Y-m-d H:i:s', time());
    
    if (!$result){
        $query = "INSERT INTO $table(hosting_type, product_name,  my_custom_product_name, final_cost, cores, ram, diskspace, bandwidth, dedicated_ip, ghz, mbit, createdAt, updatedAt) VALUES ('$dedicated_hosting_plan->hosting_type', '$dedicated_hosting_plan->product_name', '$dedicated_hosting_plan->my_custom_product_name', '$dedicated_hosting_plan->final_cost', '$dedicated_hosting_plan->cores', '$dedicated_hosting_plan->ram', '$dedicated_hosting_plan->diskspace', '$dedicated_hosting_plan->bandwidth', '$dedicated_hosting_plan->dedicated_ip', '$dedicated_hosting_plan->ghz', '$dedicated_hosting_plan->mbit', '$date', '$date' );";
        $result = mysqli_query($db_handle,$query);
        if (!$result){
            echo "Adding record $dedicated_hosting_plan->product_name failed to table $table <br>";
        }else{
            echo "Successfully added Record  $dedicated_hosting_plan->product_name to $table <br> ";
        }
    }else{
        $id = $result['id'];
        $query = "UPDATE $table SET product_name='$dedicated_hosting_plan->product_name',my_custom_product_name='$dedicated_hosting_plan->my_custom_product_name',final_cost='$dedicated_hosting_plan->final_cost',cores='$dedicated_hosting_plan->cores',ram='$dedicated_hosting_plan->ram',diskspace='$dedicated_hosting_plan->diskspace', bandwidth='$dedicated_hosting_plan->bandwidth',dedicated_ip='$dedicated_hosting_plan->dedicated_ip', ghz='$dedicated_hosting_plan->ghz', mbit='$dedicated_hosting_plan->mbit', updatedAt='$date' WHERE id=$id;";
        $result = mysqli_query($db_handle,$query);
        if (!$result){
            echo "Updating $dedicated_hosting_plan record in $table failed <br>";
        }else{
            echo "Successfully updated Record with id $id to $table <br> ";
        }
    }
}


//Add Addons to DB
$table = "Addons";
$query_key = "addon_code";
$response = file_get_contents("$base_url/addons-price?token=$token");
$addons = json_decode($response);

foreach ($addons as $addon) {
    $query = "SELECT id FROM $table where $query_key='$addon->addon_code'";
    $run_query = mysqli_query($db_handle,$query);
    $result = mysqli_fetch_array($run_query);
    $date = date('Y-m-d H:i:s', time());
    
    if (!$result){
        $query = "INSERT INTO $table(addon_type, addon_code, cost, createdAt, updatedAt) VALUES ('$addon->addon_type', '$addon->addon_code', '$addon->cost', '$date', '$date' );";
        $result = mysqli_query($db_handle,$query);
        if (!$result){
            echo "Adding record $addon->addon_code failed to table $table <br>";
        }else{
            echo "Successfully added Record $addon->addon_type to $table <br> ";
        }
    }else{
        $id = $result['id'];
        $query = "UPDATE $table SET addon_type='$addon->addon_type', cost='$addon->cost', updatedAt='$date' WHERE id=$id;";
        $result = mysqli_query($db_handle,$query);
        if (!$result){
            echo "Updating $addon->tld record in $table failed <br>";
        }else{
            echo "Successfully updated Record with id $id to $table <br> ";
        }
    }
}

// Close connection
mysqli_close($db_handle);
