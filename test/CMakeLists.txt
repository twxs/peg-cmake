cmake_minimum_required(VERSION #ARG COMMENT
3.2.0            #Major[.Minor[.Patch[.Tweak]]]
FATAL_ERROR)
     if( (ARG AND ${ARG}) OR TRUE ) 
           message("(arguments)")
endif()


foreach(p
CMP0020 #CMake 2.8.11
 CMP0022 #           CMake 2.8.12
    CMP0025 #                    CMake 3.0
CMP0053                   #CMake 3.1
)
if(              TRUE)
message( "IF")
elseif(   FALSE    )
                   message("ELSEIF")
  else()
 message("ELSE")
endif()
endforeach()

message([=[
This is the first line in a 
bracket argument with bracket length 1.
No \-escape sequences or ${variable}
references are evaluated.
This is always one argument even
 though it contains a ; character.
The text does not end on a closing
 bracket of length 0 like ]].
It does end in a closing bracket
 of length 1.
]=])

#[=[
brcket commet
brcket commet
brcket commet
]=]

#[=[This is a bracket comment.
It runs until the close bracket.]=]
message("First Argument\n" #[[Bracket Comment]] "Second Argument")
