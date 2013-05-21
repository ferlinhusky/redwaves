<?php
    // Get passcode param
    $passcode = $_GET["passcode"];
    
    // Convert blanks to "A"s
    
    // Convert to 96 binary blocks of six bits each
    
    // Concat the blocks into a long string -> 576
        // If block isn't exactly 576 chars, return error
    
    // Discard first 4 chars -> 572
    
    // Split the rest into usable blocks
    
    /*
        0-7     Player types
        8-11    Genders
        12-43   Player level
        44-139  Inventory
        140-219 Skills
        220-363 Armor
        364-391 Max HP
        392-411 Max Movement
        412-475 Spells
        476-571 Weapons
    */
    
    // Write JSON data
    
    // Return JSON
?>